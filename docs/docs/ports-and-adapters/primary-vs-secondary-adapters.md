---
sidebar_position: 3
tags:
  - ports adapters primary secondary
---

# Primary vs Secondary Adapters

Adapters can be classified as _primary_ or _secondary_ based on the purpose of the adapter and direction of data flow relative to the core application.

![Ports and Adapters Architecture Diagram](/img/ports-and-adapters-architecture.svg)

1. **Primary Adapters (Driving Adapters):**

   - **Purpose:** Primary adapters are used to initiate interaction with the application's core. They are the entry point for the application, triggering use cases or business logic. These adapters typically represent the different ways an application can be driven by an outside actor, such as a user, an external system, or an automated job.
   - **Examples:** A web interface, a REST API endpoint, a command-line interface, or a scheduled job that triggers a specific process in the application.
   - **Direction of Data Flow:** Inward towards the application core. Primary adapters take external inputs (like user commands or API calls), convert them into a format understandable by the application's ports (interfaces), and drive the application's use cases.

![Primary Adapters - Incoming](/img/secondary-vs-primary-adapters.svg)

1. **Secondary Adapters (Driven Adapters):**
   - **Purpose:** Secondary adapters are used by the application to interact with external systems or tools, such as databases, external APIs, file systems, or messaging systems. They serve to isolate the application core from external concerns, ensuring that the business logic remains decoupled from infrastructure and external interfaces.
   - **Examples:** A database adapter for retrieving and storing data, an email service adapter for sending notifications, or an adapter for calling an external web service.
   - **Direction of Data Flow:** Outward from the application core. Secondary adapters implement the outward-facing ports defined by the application's core, allowing the core to communicate with external resources without being directly coupled to them.

![Secondary Adapters- Outgoing](/img/secondary-vs-primary-adapters-2.svg)

The primary distinction between the two lies in their roles relative to the application's core:

1. Primary adapters bring information into the core, triggering business logic

2. Secondary adapters take information out, allowing the core to affect external systems or resources.

![Primary and Secondary Adapters](/img/secondary-vs-primary-adapters-3.svg)

This separation supports the hexagonal architecture's goal of creating a loosely coupled, easily testable, and maintainable system.

Next, let's explore the benefits of hexagonal architectures through a detailed example centered around lodging an insurance claim.
