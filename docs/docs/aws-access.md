---
sidebar_position: 2
tags:
  - aws access account
---

# AWS Access

## IAM User (Reccomened for workshop)

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

## AWS Workshop Studio

> Note: You'll need a **valid access code** to proceeed with this option.

1. Navigate to the [AWS Workshop Studio page](https://catalog.us-east-1.prod.workshops.aws/)

2. Click on 'Get Started'

   ![Get started with AWS Workshop Studio](/img/workshop-studio-get-started.png)

3. Enter your access code

   ![Enter your access code](/img/workshop-studio-enter-access-code.png)

4. Retrieve your AWS CLI Credentials

- Click on **Get AWS CLI Credentials**
  ![AWS Workshop Studio landing page](/img/workshop-studio-landing-page.png)
- Click on **Linux or macOS (bash)**
  ![AWS Workshop Studio credentials](/img/workshop-studio-credentials.png)
- Take note of the following values:
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_SESSION_TOKEN

## Guidance for Organizational Account Users

Ensure you possess the required permissions to execute these actions within your AWS environment. If unsure, please consult your account administrator and adhere strictly to your organization's policies.

## Wrapping Up

With these preparations, you're now fully set to embark on the 'I'm Bringin' Hexy Back' workshop journey. Should you face any roadblocks, do not hesitate to refer to AWS documentation or contact the workshop facilitator for support.
