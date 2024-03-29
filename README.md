# hexyback-workshop

## Link to this Github repository 💻

![Github Reository QR Code](https://github.com/BenBowers/hexyback-workshop/blob/main/hexy-back-github-repository-qr-code.png?raw=true)

## Visit our hosted documentation 📚

[Hexyback Workshop Documentation](https://benbowers.github.io/hexyback-workshop/)

## About

This educational journey is designed for enthusiastic learners like you, aiming to demystify the complexities of cloud technology and application architecture.

Throughout this workshop, we will dive deep into the principles of building scalable and maintainable software. By focusing on a financial services application, we aim to provide you with real-world scenarios and challenges. This approach not only enhances learning but also equips you with practical skills that are immediately applicable in professional settings.

Our curriculum is structured around the concept of hexagonal architecture, also known as the ports and adapters pattern. This architectural style promotes the separation of concerns, making your applications more modular, easier to test, and adaptable to changes in external services or databases. By embracing this architecture, you'll learn to construct systems that are resilient to infrastructure changes and technological advances.

To streamline our development and deployment processes, we'll employ SST (Serverless Stack), a modern framework designed to simplify the building and managing of serverless applications on AWS. SST features live Lambda development, which means you can test your Lambda functions locally without redeploying them to the cloud. This immediate feedback loop accelerates the development cycle and enhances your understanding of cloud infrastructure.

## Install 🛠️

This project will require NodeJS20, pnpm & the AWS cli v2

### Checkout the workshop branch

```sh
git checkout workshop-start
```

### Install the dependencies

```sh
pnpm i
```

### Start the docs

```sh
pnpm run docs
```

### Deploy the application

```sh
pnpm run deploy
```

### Run the tests

#### Unit

```sh
pnpm run test
```

#### Integration

```sh
pnpm run test:integration
```
