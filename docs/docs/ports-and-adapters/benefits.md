---
sidebar_position: 4
tags:
  - ports adapters benefits
---

# Benefits of Hexagonal Architecture

1. **Improved Testability**: With the core logic decoupled from external components, testing can be more focused, easier to perform, and more comprehensive. Mocks or stubs can replace external services.
2. **Flexibility in Development**: Developers can work on different parts of the system simultaneously without stepping on each other's toes. For instance, one team can work on the database interactions while another focuses on the business logic.
3. **Ease of Maintenance and Scalability**: Updating external services or databases does not require changes to the business logic, as long as the port interfaces remain consistent.
4. **Enhanced Portability**: The application can be easily adapted to different environments or technologies, promoting longevity and reducing tech-debt.
5. **Facilitates Domain-Driven Design**: Aligning closely with DDD principles, it encourages rich domain models that are at the core of the application, surrounded by adapters that translate to and from the domain.

## An Insurance Themed Example

Let's implement a use case for lodging an insurance claim. This use case will demonstrate the practical application of hexagonal architecture principles and the benefits they offer, including improved testability, flexibility, ease of maintenance, scalability, enhanced portability, and facilitation of domain-driven design.

### Implementing the Use Case

The use case revolves around a customer lodging an insurance claim due to property damage. This process involves several components, including _primary ports_ for user interaction, _secondary ports_ for data persistence and external notifications, and _adapters_ to bridge these ports with the external world.

![Ports & Adapters - Claims](/img/ports-and-adapters-claims.svg)

#### Core Domain Models

Let's start with the core domain models, focusing on the claim itself.

```typescript
interface Claim {
  id: string;
  policyNumber: string;
  damageDescription: string;
  dateOfIncident: Date;
  contactInfo: {
    email: string;
    phone: string;
  };
}
```

#### Primary Ports

Primary ports define the core functionalities our application offers. In this case, we're focusing on lodging a claim and querying claim status.

```typescript
interface ClaimServicePort {
  lodgeClaim(claim: Claim): Promise<void>;
  queryClaimStatus(claimId: string): Promise<string>;
}
```

#### Secondary Ports

Secondary ports abstract the interactions with external services or systems. We need two secondary ports: one for persisting claims and another for notifying assessors.

```typescript
interface ClaimRepositoryPort {
  save(claim: Claim): Promise<void>;
}

interface AssessorNotificationPort {
  notifyAssessor(claimId: string): Promise<void>;
}
```

#### API Gateway Adapter (Primary Adapter)

An API Gateway Adapter serves as the entry point for lodging and querying claims. It translates HTTP requests into actions on the core application.

```typescript
class ApiGatewayAdapter implements ClaimServicePort {
  constructor(private claimService: ClaimService) {}

  async lodgeClaim(req: Request): Promise<Response> {
    const claim: Claim = req.body; // Simplification for demonstration
    await this.claimService.lodgeClaim(claim);
    return new Response('Claim lodged successfully', { status: 200 });
  }

  async queryClaimStatus(req: Request): Promise<Response> {
    const { claimId } = req.params;
    const status = await this.claimService.queryClaimStatus(claimId);
    return new Response(status, { status: 200 });
  }
}
```

#### DynamoDB Adapter (Secondary Adapter for Persistence)

This adapter implements the `ClaimRepositoryPort` for persisting claims in DynamoDB.

```typescript
import { DynamoDB } from 'aws-sdk';

class DynamoDBAdapter implements ClaimRepositoryPort {
  private db = new DynamoDB.DocumentClient();

  async save(claim: Claim): Promise<void> {
    const params = {
      TableName: 'Claims',
      Item: claim,
    };
    await this.db.put(params).promise();
  }
}
```

#### EventBus Adapter (Secondary Adapter for Notifications)

This adapter utilizes an event bus (e.g., AWS EventBridge) to notify assessors about new claims that need their attention.

```typescript
import { EventBridge } from 'aws-sdk';

class EventBusAdapter implements AssessorNotificationPort {
  private eventBridge = new EventBridge();

  async notifyAssessor(claimId: string): Promise<void> {
    const params = {
      Source: 'claimService',
      DetailType: 'ClaimAssessmentRequested',
      Detail: JSON.stringify({ claimId }),
      EventBusName: 'default',
    };
    await this.eventBridge.putEvents(params).promise();
  }
}
```

### Benefits Illustrated

Through this example, we can observe several benefits of hexagonal architecture:

- **Testability**: The core domain logic (e.g., `ClaimService`) can be tested independently of its external dependencies by mocking the ports.
- **Flexibility**: Adapters can be swapped with minimal impact on the core domain. For instance, switching from DynamoDB to another database requires changes only in the persistence adapter.
- **Ease of Maintenance**: Changes in the notification mechanism or persistence layer don't affect the core application logic.
- **Scalability**: The architecture supports scaling individual components (e.g., introducing more sophisticated notification logic) without reworking the entire system.
- **Portability**: The application can be deployed in different environments with varying technologies by simply providing the appropriate adapters for those environments.

This example showcases how hexagonal architecture can enhance the development, maintenance, and evolution of complex systems, making it a powerful pattern for designing resilient and adaptable software.

To further demonstrate the flexibility and modularity of the hexagonal architecture, let's replace the EventBus adapter with an SNS (Simple Notification Service) adapter for notifying assessors. This swap illustrates how easily external dependencies can be interchanged without affecting the core business logic or the rest of the system.

### SNS Adapter for Assessor Notification

We will implement a new adapter that adheres to the `AssessorNotificationPort` interface, utilizing AWS SNS for sending notifications instead of EventBridge.

![Ports & Adapters - Claims](/img/ports-and-adapters-claims-2.svg)

This change requires updating only the notification adapter, showcasing the decoupling and adaptability inherent in hexagonal architecture.

![Ports & Adapters - Claims](/img/ports-and-adapters-claims-3.svg)

```typescript
import { SNS } from 'aws-sdk';

class SNSAdapter implements AssessorNotificationPort {
  private sns = new SNS();

  async notifyAssessor(claimId: string): Promise<void> {
    const params = {
      Message: JSON.stringify({ claimId }),
      TopicArn: 'arn:aws:sns:region:account-id:AssessorNotificationTopic',
    };
    await this.sns.publish(params).promise();
  }
}
```

### Integration with the Core Application

The core application, specifically the service that handles the logic for notifying assessors, remains unchanged. It still depends on the `AssessorNotificationPort`, unaware of the specific implementation, whether it's EventBridge or SNS.

### Benefits of Switching Adapters

- **Seamless Integration Changes**: By swapping the adapter from EventBridge to SNS, we demonstrate the ease of integrating different AWS services or external tools without altering the core domain or the application flow.
- **Scalability and Cost Optimization**: Depending on the project's requirements, SNS might offer a more scalable or cost-effective solution for notifications compared to EventBridge, or vice versa. The architecture allows for easy experimentation and optimization.
- **Focused Adaptation**: When a new requirement or an optimization opportunity arises, only the relevant adapter needs to be modified or replaced. This localized change minimizes the risk of introducing bugs into the system and simplifies testing.

### Conclusion

Replacing the EventBridge adapter with an SNS adapter in a hexagonal architecture exemplifies the pattern's strength in isolating core logic from external services. This approach enhances maintainability, allows for straightforward integration of new technologies, and ensures that the application remains agile and adaptable to change. Such modularity is crucial for long-term software health and evolution, making hexagonal architecture a valuable design choice for complex systems.
