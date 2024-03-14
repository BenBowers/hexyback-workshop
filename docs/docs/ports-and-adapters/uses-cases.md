---
sidebar_position: 2
tags:
  - ports adapters use cases
---

# Use Cases

A **use case** in this context is an encapsulated piece of business logic that performs a specific function or process in response to a request from an external source. For example, in a banking application, a use case might be _"Transfer Money"_, _"Check Balance"_, or _"Create New Account"_. Each of these use cases represents a distinct set of steps or actions that need to be performed to achieve a particular business objective.

![Ports and Adaptors Hexagonal Diagram](/img/ports-and-adapters-hexagon.svg)

> By focusing on use cases, the ports and adapters architecture aims to keep the application's core logic decoupled from external concerns, making it easier to understand, maintain, and test the business rules independently of the infrastructure and interfaces.

In our workshop we'll be working with Hexy, (a simplified) financial services application.

Hexy defines the following use cases:

1. Create a borrower profile
2. Get an estimate of a borrower's borrowing capacity
3. Apply for a loan
