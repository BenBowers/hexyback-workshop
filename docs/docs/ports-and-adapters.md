---
sidebar_position: 2
tags:
  - ports adapters architecture
---

# Ports & Adapters

In the ports and adapters model, the application is divided into two distinct parts:

- The _"inside"_ part, which contains the business logic, including the **use cases**
- The _"outside"_ part, which consists of **adpaters** that connect to external systems (e.g. datbases, web interfaces, 3rd party services)

The _"ports"_ are interfaces that define how external systems can communicate with the application's business logic (**use cases**). **Adapters** implement these **ports** to translate between the external systems and the application's core logic.

![Ports and Adapters Architecture Diagram](/img/ports-and-adapters-architecture.svg)

A use case in this context is an encapsulated piece of business logic that performs a specific function or process in response to a request from an external source. For example, in a banking application, a use case might be "Transfer Money", "Check Balance", or "Create New Account". Each of these use cases represents a distinct set of steps or actions that need to be performed to achieve a particular business objective.

By focusing on use cases, the ports and adapters architecture aims to keep the application's core logic decoupled from external concerns, making it easier to understand, maintain, and test the business rules independently of the infrastructure and interfaces.

In our workshop we'll be working with Hexy, (a simplified) financial services application.

Hexy defines the following use cases:

1. Create a borrower profile
2. Get an estimate of a borrower's borrowing capacity
3. Apply for a loan

## Primary vs Secondary Adapters

Adapters can be classified as _primary_ or _secondary_ based on the purpose of the adapter and direction of data flow relative to the core application.

![Ports and Adaptors Hexagonal Diagram](/img/ports-and-adapters-hexagon.svg)

1. **Primary Adapters (Driving Adapters):**

   - **Purpose:** Primary adapters are used to initiate interaction with the application's core. They are the entry point for the application, triggering use cases or business logic. These adapters typically represent the different ways an application can be driven by an outside actor, such as a user, an external system, or an automated job.
   - **Examples:** A web interface, a REST API endpoint, a command-line interface, or a scheduled job that triggers a specific process in the application.
   - **Direction of Data Flow:** Inward towards the application core. Primary adapters take external inputs (like user commands or API calls), convert them into a format understandable by the application's ports (interfaces), and drive the application's use cases.

2. **Secondary Adapters (Driven Adapters):**
   - **Purpose:** Secondary adapters are used by the application to interact with external systems or tools, such as databases, external APIs, file systems, or messaging systems. They serve to isolate the application core from external concerns, ensuring that the business logic remains decoupled from infrastructure and external interfaces.
   - **Examples:** A database adapter for retrieving and storing data, an email service adapter for sending notifications, or an adapter for calling an external web service.
   - **Direction of Data Flow:** Outward from the application core. Secondary adapters implement the outward-facing ports defined by the application's core, allowing the core to communicate with external resources without being directly coupled to them.

The primary distinction between the two lies in their roles relative to the application's core: primary adapters bring information into the core, triggering business logic, while secondary adapters take information out, allowing the core to affect external systems or resources. This separation supports the hexagonal architecture's goal of creating a loosely coupled, easily testable, and maintainable system.
