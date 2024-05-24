# FarmBot with FLIR AX8 Camera Integration

## Project Basic Information

![FarmBot](https://farm.bot/cdn/shop/files/DSC00260_2400x_87666fa7-02d0-41eb-9a12-0cc5938f39be_1200x600_crop_center.jpg?v=1600237043)

FarmBot is an open-source precision agriculture technology project aimed at changing the way traditional agriculture is practiced. 
It allows users to precisely control planting, watering, fertilizing, and weeding processes to achieve self-sufficiency in food.
 Connected via the internet, FarmBot enables users to remotely manage their gardens or farms, optimizing plant growth conditions while reducing resource waste.

## Project Introduction

![Ax8](https://neroteam.com/blog/pages/flir-ax8-vulnerability-report/flir-1.jpg?m=1673082924)

In this project, we introduce a FLIR AX8 thermal imaging camera to the FarmBot system to enhance its monitoring capabilities. 
The FLIR AX8 is an advanced thermal imaging camera capable of providing real-time temperature monitoring and thermal analysis. 
By integrating the FLIR AX8 camera into the FarmBot system, our goal is to enable users to remotely monitor the temperature conditions of their FarmBot farms in real-time, further optimizing plant growth environments, preventing diseases and pests, and improving crop production efficiency.

## GitHub Repository Guide

### Folder Structure


- **[docs/](./docs/)** - Documentation folder
  - **[Sprint 1/](./docs/Sprint%201/)** - Sprint 1 documentation

    - [Project Details PDF](./docs/Sprint%201/project_detail.pdf)
    - **[Requirement/](./docs/Sprint%201/Requirement/)** - Requirements documentation
      - [User Story PDF](./docs/Sprint%201/Requirement/user_story.pdf)
      - [Acceptance Criteria PDF](./docs/Sprint%201/Requirement/Acceptance_Criteria.pdf)
    - [Technical Details PDF](./docs/Sprint%201/technical_details.pdf)
    - [Sprint Plan PDF](./docs/Sprint%201/Sprint_plan.pdf)
    - [CheckList](./docs/Sprint%201/Sprint1_CheckList.pdf)
  - **[Sprint 2/](./docs/Sprint%202/)** - Sprint 2 documentation
    - [Project Details PDF](./docs/Sprint%202/project_detail.pdf) -updated
    - **[Requirement/](./docs/Sprint%202/Requirement/)** - Requirements documentation -updated
      - [User Story PDF](./docs/Sprint%202/Requirement/user_story.pdf)
      - [Acceptance Criteria PDF](./docs/Sprint%202/Requirement/Acceptance_Criteria.pdf)
    - [Technical Details PDF](./docs/Sprint%202/technical_details.pdf)
    - [Cyber Security PDF](./docs/Sprint%202/Cyber_Security.pdf)
    - [Ethical Considerations PDF](./docs/Sprint%202/Ethical_Considerations.pdf)
    - [Sprint 2 Code Review PDF](./docs/Sprint%202/Sprint2_Code_Review2.pdf)
    - [Sprint 3 Plan PDF](./docs/Sprint%202/Sprint_plan.pdf) -- updated
    - [CheckList](./docs/Sprint%202/Sprint2_CheckList.md) -- updated
  - **[Sprint 3/](./docs/Sprint%203/)** - Sprint 3 documentation
    - [Project Details PDF](./docs/Sprint%203/project_detail.pdf) -updated
    - **[Requirement/](./docs/Sprint%203/Requirement/)** - Requirements documentation -updated
      - [User Story PDF](./docs/Sprint%203/Requirement/user_story.pdf)
      - [Acceptance Criteria PDF](./docs/Sprint%203/Requirement/Acceptance_Criteria.pdf)
    - [Technical Details PDF](./docs/Sprint%203/technical_details.pdf)
    - [Cyber Security PDF](./docs/Sprint%203/Cyber_Security.pdf) -updated
    - [Ethical Considerations PDF](./docs/Sprint%203/Ethical_Considerations.pdf) -updated
    - [Sprint 3 Code Review PDF](./docs/Sprint%203/Sprint3_Code_Review2.pdf)
    - [Sprint 4 Plan PDF](./docs/Sprint%203/Sprint_plan.pdf) -- updated
    - [CheckList](./docs/Sprint%203/Sprint3_CheckList.md) -- updated
  - **[Sprint 4/](./docs/Sprint%204/)** - Sprint 4 documentation (to be added)
- **[src/](./src/)** - Source code folder (to be populated starting from Sprint 2)
- **[tests/](./tests/)** -- test cases
  - **[IntegrationTests/](./tests/IntegrationTests/)**
    - [Overall Testing PDF](./tests/IntegrationTests/Imaging_Integration_Testing.pdf)
    - [Integration Testing PDF](./tests/IntegrationTests/Integration_Testing.pdf)
- **[data sample/](./data%20sample/)** -- #input data (to be added)
- **[README.md](./README.md)** - This file
## Workflow Guidelines

Ensuring smooth progress and collaboration within our project requires adhering to certain workflow guidelines. Below are the key practices we follow:

### Branch Naming Convention

To maintain clarity and organization in our codebase, we use specific prefixes for branch names based on the type of work being done:

- **Feature branches** should start with `feature/`, followed by a brief description of the feature. Example: `feature/user-authentication`.
- **Bugfix branches** should start with `fix/`, followed by a brief description of the fix. Example: `fix/login-issue`.

### Commit Message Guide

Commit message should include:

- A short, descriptive title (50 characters max) summarizing the change.
- A detailed description (if necessary) explaining the reason for the change and its impact.


### Pull Request (PR) Process

To maintain the quality and consistency of our project, follow these steps for submitting and reviewing pull requests:

1. **Creating a PR**: Once work on a branch is complete, create a pull request on GitHub. The PR description should clearly describe the changes and their purpose.
2. **Code Review**: At least one other team member should review the PR for feedback or approval.
3. **Merging PRs**: After review and approval, PRs can be merged into the main branch. Ensure that the PR passes all automated tests before merging.

### Document Updates

Updates to documentation files, such as this README, can be made directly in the `main` branch to streamline the process of keeping our project documentation current.




## Changelog

- **Sprint 1:**
  - **Project initialization and requirement gathering**: Established the project framework and gathered initial requirements from stakeholders. This foundational step ensured that the project was aligned with user needs and project objectives.
  - **Preliminary integration design for FarmBot and FLIR AX8 thermal imaging camera**: Developed a conceptual design for integrating the FLIR AX8 camera with the FarmBot system. This included evaluating potential technical challenges and proposing initial solutions to facilitate real-time temperature monitoring.
  - **Creation of GitHub repository and documentation structure**: Set up the project's GitHub repository, establishing a clear documentation structure to support collaborative development and project tracking. This setup included initial guides, technical documentation, and plans for future documentation updates.
  - **Challenges encountered**: Faced challenges in ensuring compatibility between FarmBot's existing software and the FLIR AX8 camera's data output formats. Through a collaborative effort, the team identified potential middleware solutions to bridge this gap.
  - **Next steps**: For the upcoming Sprint 2, the team plans to focus on developing a prototype for the FLIR AX8 integration, conducting initial tests to validate the integration concept, and refining the project's requirement documentation based on initial feedback.
  
- **Sprint 2:**
  - **Resolution of technical challenges from Sprint 1**:
    - Successfully resolved key technical issues identified in the previous sprint, including linking the FLIR AX8 thermal imaging camera with Raspberry Pi.
    - Powered the FLIR AX8 using the FarmBot motherboard, enabling the combined operation of the FLIR AX8, Raspberry Pi, and FarmBot motherboard in a production environment.
  - **Deployment of the FarmBot web application**:
    - The team successfully deployed the FarmBot web application in a local environment.
    - Added a new tag to the web app to interface with the AX8 thermal imaging camera's API, enhancing the system's functionality.
  - **Integration of camera and web application**:
    - Developed and implemented a series of technical solutions for integrating the thermal imaging camera with the web app.
    - Set up a server-client architecture using FRP for internal network penetration to project the camera's service to the public internet.
    - Configured complex Nginx setups to handle cross-origin issues related to cookie transmission when using third-party services.
  - **Exploration of server security**:
    - Discussed and explored various server security measures, including defenses against indiscriminate script scanning and other potential security threats.
  - **Challenges encountered**:
    - The team faced challenges in ensuring compatibility between FarmBot's existing software and the FLIR AX8 camera's data output formats during the early stages of the sprint. Through a collaborative effort, potential middleware solutions were identified to bridge this gap.
    - Moving forward, a significant challenge will be the full deployment of the FarmBot system in a server production environment, ensuring that all features of the FLIR AX8 are fully utilized while maintaining speed and quality.

  - **Next steps**:
    - The focus of the team will shift from hardware components (Raspberry Pi, FarmBot, AX8 camera) and middleware (FRP for internal network penetration) towards backend and software improvements.
    - Future implementations will prioritize enhancing the user experience and core functionality, ensuring a seamless integration of all system components and a robust platform for end-users.
- **Sprint 3:**
  - **Migration to School Servers**:
    - Successfully migrated the FarmBot web application and services from AWS to school-provided servers, enhancing security and performance.
    - Implemented FRP (Fast Reverse Proxy) to replace Ngrok and Nginx for exposing hardware functionalities securely to the public network.
  - **Full Deployment and Testing**:
    - Deployed the complete system, including the FarmBot web application, FLIR AX8 camera, and Raspberry Pi, on the new server infrastructure.
    - Conducted extensive testing to ensure stable and secure operation in the new environment.
  - **3D-Printed Camera Mount**:
    - Created a new 3D-printed mount for the FLIR AX8 camera on the FarmBot, improving adaptability and adjustability.
  - **Software Development**:
    - Completed the comprehensive development of the web application, fully integrating the FLIR AX8 camera functionalities and developing customized data display features through APIs, including image download and matrix-formatted downloads.
  - **Middleware and Integration**:
    - Optimized middleware solutions to ensure seamless data transmission and integration between hardware components and the web application.
  - **Security Enhancements**:
    - Continued utilizing Cloudflare for domain management, leveraging its automated DDoS protection and Web Application Firewall (WAF) to enhance server security.
    - Developed and implemented additional firewall rules and security protocols to protect against potential threats.
  - **Challenges Encountered**:
    - Encountered issues integrating functionalities into the Rust and Ruby-based FarmBot code base. Resolved by implementing local Python microservices, enhancing maintainability and scalability.
    - Addressed cross-domain security issues and ensured secure data transmission using FRP.

  - **Next steps**:
    - **Integration Technique Improvements**:
      - Plan to improve the integration methods for the FLIR AX8 camera with the FarmBot web application by simplifying communication protocols and enhancing data handling, preparing for future machine learning functionalities.
    - **Enhanced Security Measures**:
      - Develop and implement enhanced security protocols to ensure the integrity and confidentiality of data transmitted between devices and the web application, further improving the system’s scalability and maintainability to address future challenges.


## Team Members

- 1359023 - Haoyang Zheng 
- 1371298 - Yue Zhang 
- 1348023 - Naixin Xu 
- 1351298 - Junye Zhou 
- 1343866 - Yinkai Chai 
- 1372712 - Haitian Li 



 






