---
sidebar_position: 4
tags:
  - setup aws docker dev-container vscode
---

# Development Environment

## Check out the workshop repository

1. Change into your workspace directory:

   ```sh
   cd /path/to/your/workspace
   ```

2. Clone the [hexyback-workshop](https://github.com/BenBowers/hexyback-workshop) repository.

   ```sh
   # Using HTTPS
   git clone https://github.com/BenBowers/hexyback-workshop.git
   ```

   ```sh
   # Using SSH
   git clone git@github.com:BenBowers/hexyback-workshop.git
   ```

3. Change into the `hexyback-workshop` directory

   ```sh
   cd hexyback-workshop
   ```

4. Open the `hexyback-workshop` folder in VS Code

   ```sh
   code .
   ```

5. Start the Development Container

   Run the `Dev Containers: Reopen in Container` command from the Command Palette (`F1`) or quick actions Status bar item (click the green button in the bottom left corner of VS Code)

   ![Start Development Container in VS Code](/img/remote-status-bar.png)

## Configuring the AWS CLI with IAM Credentials

We are now working inside a development container where the AWS CLI has been preinstalled. Follow these steps to configure the AWS CLI with your IAM credentials:

### Step 1: Prepare Your IAM Credentials

Before starting the configuration process, ensure you have your IAM credentials ready. These consist of:

- **AWS Access Key ID**
- **AWS Secret Access Key**

These credentials should have been obtained when you [created your IAM user previously](./intro#setting-up-aws-access). If you have not created an IAM user or lost your credentials, you will need to create a new IAM user and download the credentials.

### Step 2: Open Your Development Container's Terminal

1. Access the integrated terminal in your development environment. This is typically done by opening the command palette (usually Ctrl+Shift+P or Cmd+Shift+P on Mac) and selecting `Terminal: Create New Integrated Terminal` or by navigating to the terminal panel in your IDE.

### Step 3: Configure the AWS CLI

1. In the terminal, type the following command and hit Enter:

   ```bash
   aws configure
   ```

2. When prompted, enter your **AWS Access Key ID** and hit Enter.
3. Next, enter your **AWS Secret Access Key** and hit Enter.
4. For the **Default region name**, enter the AWS Region you will be working in: `ap-southeast-2`. Press Enter.
5. For the **Default output format**, enter `json` (this is the most common format). Press Enter.

   Here's an example of how the prompts might look:

   ```text
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: ap-southeast-2
   Default output format [None]: json
   ```

### Step 4: Verify Configuration

To ensure that your AWS CLI is configured correctly with your new IAM credentials, you can run a simple AWS CLI command to list the S3 buckets in your account:

```bash
aws s3 ls
```

If the AWS CLI is configured correctly, you should see a list of S3 buckets in your account (or an empty list if no buckets have been created). If you receive an error, verify that you entered your credentials and settings correctly in the previous steps.
