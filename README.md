# JavaScript Guestbook Cloud Application

This application is a full-stack guestbook designed to demonstrate modern cloud-native deployment strategies using Docker, Kubernetes, and OpenShift.

## Core Technologies

- **Docker**: Packages an app and its dependencies into an isolated container so it runs identically on any computer.
- **Kubernetes**: Orchestrates thousands of those containers across multiple servers, scaling them up or down automatically.
- **OpenShift**: A paid, enterprise version of Kubernetes that adds built-in security, monitoring, and developer dashboards.

## Implementation Details

### How These Technologies are Used
- **Docker**: Used to containerize the Express backend and Vite frontend into a single production-ready image defined in `/k8s/Dockerfile`.
- **Kubernetes**: Manifests in `/k8s/` (deployment, service, hpa) define how the application is managed in a cluster, including autoscaling via the Horizontal Pod Autoscaler.
- **OpenShift**: The application is compatible with OpenShift's internal image registry and security context constraints, facilitating easy deployment to IBM Cloud and other enterprise environments.

### Languages and Frameworks
- **JavaScript**: Used for both the frontend (React) and backend (Express) for a lightweight, flexible implementation.
- **React**: Powering the user interface with a modern, responsive "Elegant Dark" theme.
- **Node.js/Express**: Handling the server-side logic and API endpoints.
- **Tailwind CSS**: Providing utility-first styling for the polished UI.
- **YAML**: Defining Kubernetes configurations.

## Functionality
- **User Authentication**: Secure sign-up and login system.
- **Authorization**: Users can only view and manage their own guestbook entries, ensuring data privacy.
- **Real-time Simulation**: Built-in lab indicators showing CPU usage, cloud connectivity status, and Kubernetes topology.
- **Lab Artifacts**: Integrated viewer for technical deliverables requested in the lab assignment.

## Usage in IBM Cloud
The application is designed to be pushed to the IBM Cloud Container Registry (ICR) and deployed to an IKS (IBM Kubernetes Service) or OpenShift cluster.
