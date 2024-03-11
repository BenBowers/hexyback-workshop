---
sidebar_position: 3
tags:
  - prerequisites
---

# Prerequisites

Before diving into the heart of this workshop, ensure you have the following tools installed on your local machine:

1. [Docker](https://docs.docker.com/get-docker/): A must-have for running containerized applications.
2. [VS Code IDE](https://code.visualstudio.com/): Our recommended integrated development environment.
3. [VS Code Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers): Enhances the capability of VS Code by enabling development inside containers.
4. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git): Essential for version control and source code management.

## Setting Up AWS Access

### Step 1: Access Your AWS Account

Navigate to the [AWS Management Console](https://aws.amazon.com/console/) and log in with your credentials.

### Step 2: Establish an IAM User

1. Within the AWS Management Console, select **IAM** under Security, Identity, & Compliance from the **Services** dropdown.
2. Click **Add users** in the IAM dashboard's Users section.
3. Set your username (e.g., `hexy-workshop-user`) and choose **Programmatic access** to generate an access key ID and secret access key.
4. Proceed to **Permissions**.

### Step 3: Grant AdministratorAccess

1. Select **Attach existing policies directly** and find `AdministratorAccess`.
2. After selecting the policy, you can optionally add tags before reviewing and confirming the user creation.

### Step 4: Secure Your Credentials

Upon user creation, download and securely store the `.csv` file containing your new credentials—remember, this is your only chance to copy these details.

### Guidance for Organizational Account Users

Ensure you possess the required permissions to execute these actions within your AWS environment. If unsure, please consult your account administrator and adhere strictly to your organization's policies.

### Wrapping Up

With these preparations, you're now fully set to embark on the 'I'm Bringin' Hexy Back' workshop journey. Should you face any roadblocks, do not hesitate to refer to AWS documentation or contact the workshop facilitator for support.
