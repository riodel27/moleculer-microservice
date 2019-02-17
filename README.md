[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# moleculer-microservice

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose


## docker and google kubernetes engine

# Before you begin
Take the following steps to enable the Kubernetes Engine API:

1. Visit the Kubernetes Engine page in the Google Cloud Platform Console.
2. Create or select a project.
3. Wait for the API and related services to be enabled. This can take several minutes.
4. Make sure that billing is enabled for your project. 


Set defaults for the gcloud command-line tool
cmd: 
~ gcloud config set project [PROJECT_ID]
~ gcloud config set compute/zone us-central1-b

Step 1: Build the Container Image
 ~ docker build -t gcr.io/${PROJECT_ID}/hello-app:v1 .

Step 2: Upload the container image
 ! First, configure Docker command-line tool to authenticate to Container Registry (you need to run this only once):
 ~ gcloud auth configure-docker
 ~ docker push gcr.io/${PROJECT_ID}/hello-app:v1

Step 3: Run your container locally (optional)
 ~ docker run --rm -p 8080:8080 gcr.io/${PROJECT_ID}/hello-app:v1
 ~ curl http://localhost:8080

Step 4: Create a container cluster
 ~ gcloud container clusters create ${cluster name that you want} --num-nodes=3
 ~ gcloud compute instances list
    
    Note: If you are using an existing Google Kubernetes Engine cluster or if you have created a cluster through Google Cloud Platform Console, you need to run the following command to retrieve cluster credentials and configure kubectl command-line tool with them:
    ~ gcloud container clusters get-credentials hello-cluster
    If you have already created a cluster with the gcloud container clusters create command listed above, this step is not necessary.

Step 5: Deploy your application
 ~ kubectl run hello-web --image=gcr.io/${PROJECT_ID}/hello-app:v1 --port 8080
 ~ kubectl get pods

Step 6: Expose your application to the internet
 ~ kubectl run hello-web --image=gcr.io/${PROJECT_ID}/hello-app:v1 --port 8080
 ~ kubectl get service

Step 7: Scale up your application
 ~ kubectl scale deployment hello-web --replicas=3
 ~ kubectl get deployment {service name}

Step 8: Deploy a new version of your app

GKE's rolling update mechanism ensures that your application remains up and available even as the system replaces instances of your old container image with your new one across all the running replicas.

You can create an image for the v2 version of your application by building the same source code and tagging it as v2 (or you can change the "Hello, World!" string to "Hello, GKE!" before building the image):

docker build -t gcr.io/${PROJECT_ID}/hello-app:v2 .
Then push the image to the Google Container Registry:

docker push gcr.io/${PROJECT_ID}/hello-app:v2
Now, apply a rolling update to the existing deployment with an image update:

kubectl set image deployment/hello-web hello-web=gcr.io/${PROJECT_ID}/hello-app:v2
Visit your application again at http://[EXTERNAL_IP], and observe the changes you made take effect.


SEND FEEDBACK
Kubernetes Engine Tutorials
Deploying a containerized web application
This tutorial shows you how to package a web application in a Docker container image, and run that container image on a Google Kubernetes Engine cluster as a load-balanced set of replicas that can scale to the needs of your users.

Objectives
To package and deploy your application on GKE, you must:

Package your app into a Docker image
Run the container locally on your machine (optional)
Upload the image to a registry
Create a container cluster
Deploy your app to the cluster
Expose your app to the Internet
Scale up your deployment
Deploy a new version of your app
Before you begin
Take the following steps to enable the Kubernetes Engine API:
Visit the Kubernetes Engine page in the Google Cloud Platform Console.
Create or select a project.
Wait for the API and related services to be enabled. This can take several minutes.
Make sure that billing is enabled for your project.

LEARN HOW TO ENABLE BILLING

Option A: Use Google Cloud Shell
You can follow this tutorial using Google Cloud Shell, which comes preinstalled with the gcloud, docker, and kubectl command-line tools used in this tutorial. If you use Cloud Shell, you don’t need to install these command-line tools on your workstation.

To use Google Cloud Shell:

Go to the Google Cloud Platform Console.
Click the Activate Cloud Shell button at the top of the console window.

Google Cloud Platform console

A Cloud Shell session opens inside a new frame at the bottom of the console and displays a command-line prompt.

Cloud Shell session

Option B: Use command-line tools locally
If you prefer to follow this tutorial on your workstation, you need to install the following tools:

Install the Google Cloud SDK, which includes the gcloud command-line tool.
Using the gcloud command line tool, install the Kubernetes command-line tool. kubectl is used to communicate with Kubernetes, which is the cluster orchestration system of GKE clusters:

gcloud components install kubectl
Install Docker Community Edition (CE) on your workstation. You will use this to build a container image for the application.

Install the Git source control tool to fetch the sample application from GitHub.

Set defaults for the gcloud command-line tool
To save time typing your project ID and Compute Engine zone options in the gcloud command-line tool, you can set the defaults:
gcloud config set project [PROJECT_ID]
gcloud config set compute/zone us-central1-b
Step 1: Build the container image
GKE accepts Docker images as the application deployment format. To build a Docker image, you need to have an application and a Dockerfile.

For this tutorial, you will deploy a sample web application called hello-app, a web server written in Go that responds to all requests with the message “Hello, World!” on port 80.

The application is packaged as a Docker image, using the Dockerfile that contains instructions on how the image is built. You will use this file below to package the application below.

To download the hello-app source code, run the following commands:

git clone https://github.com/GoogleCloudPlatform/kubernetes-engine-samples
cd kubernetes-engine-samples/hello-app
Set the PROJECT_ID environment variable in your shell by retrieving the pre- configured project ID on gcloud by running the command below:

export PROJECT_ID="$(gcloud config get-value project -q)"
The value of PROJECT_ID will be used to tag the container image for pushing it to your private Container Registry.

To build the container image of this application and tag it for uploading, run the following command:

docker build -t gcr.io/${PROJECT_ID}/hello-app:v1 .
This command instructs Docker to build the image using the Dockerfile in the current directory and tag it with a name, such as gcr.io/my-project/hello-app:v1. The gcr.io prefix refers to Google Container Registry, where the image will be hosted. Running this command does not upload the image yet.

You can run docker images command to verify that the build was successful:

docker images
Output:
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
gcr.io/my-project/hello-app    v1                  25cfadb1bf28        10 seconds ago      54 MB
Step 2: Upload the container image
You need to upload the container image to a registry so that GKE can download and run it.

First, configure Docker command-line tool to authenticate to Container Registry (you need to run this only once):

gcloud auth configure-docker
You can now use the Docker command-line tool to upload the image to your Container Registry:

docker push gcr.io/${PROJECT_ID}/hello-app:v1
Step 3: Run your container locally (optional)
To test your container image using your local Docker engine, run the following command:

docker run --rm -p 8080:8080 gcr.io/${PROJECT_ID}/hello-app:v1
If you're on Cloud Shell, you can can click "Web preview" button on the top right to see your application running in a browser tab. Otherwise, open a new terminal window (or a Cloud Shell tab) and run to verify if the container works and responds to requests with "Hello, World!":

curl http://localhost:8080
Once you've seen a successful response, you can shut down the container by pressing Ctrl+C in the tab where docker run command is running.

Step 4: Create a container cluster
Now that the container image is stored in a registry, you need to create a container cluster to run the container image. A cluster consists of a pool of Compute Engine VM instances running Kubernetes, the open source cluster orchestration system that powers GKE.

Once you have created a GKE cluster, you use Kubernetes to deploy applications to the cluster and manage the applications’ lifecycle.

Run the following command to create a three-node cluster named hello-cluster:

gcloud container clusters create hello-cluster --num-nodes=3
It may take several minutes for the cluster to be created. Once the command has completed, run the following command and see the cluster’s three worker VM instances:

gcloud compute instances list
Output:
NAME                                          ZONE           MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP     STATUS
gke-hello-cluster-default-pool-07a63240-822n  us-central1-b  n1-standard-1               10.128.0.7   35.192.16.148   RUNNING
gke-hello-cluster-default-pool-07a63240-kbtq  us-central1-b  n1-standard-1               10.128.0.4   35.193.136.140  RUNNING
gke-hello-cluster-default-pool-07a63240-shm4  us-central1-b  n1-standard-1               10.128.0.5   35.193.133.73   RUNNING
Note: If you are using an existing Google Kubernetes Engine cluster or if you have created a cluster through Google Cloud Platform Console, you need to run the following command to retrieve cluster credentials and configure kubectl command-line tool with them:
gcloud container clusters get-credentials hello-cluster
If you have already created a cluster with the gcloud container clusters create command listed above, this step is not necessary.
Step 5: Deploy your application
To deploy and manage applications on a GKE cluster, you must communicate with the Kubernetes cluster management system. You typically do this by using the kubectl command-line tool.

Kubernetes represents applications as Pods, which are units that represent a container (or group of tightly-coupled containers). The Pod is the smallest deployable unit in Kubernetes. In this tutorial, each Pod contains only your hello-app container.

The kubectl run command below causes Kubernetes to create a Deployment named hello-web on your cluster. The Deployment manages multiple copies of your application, called replicas, and schedules them to run on the individual nodes in your cluster. In this case, the Deployment will be running only one Pod of your application.

Run the following command to deploy your application, listening on port 8080:

kubectl run hello-web --image=gcr.io/${PROJECT_ID}/hello-app:v1 --port 8080
To see the Pod created by the Deployment, run the following command:

kubectl get pods
Output:
NAME                         READY     STATUS    RESTARTS   AGE
hello-web-4017757401-px7tx   1/1       Running   0          3s
Step 6: Expose your application to the Internet
By default, the containers you run on GKE are not accessible from the Internet, because they do not have external IP addresses. You must explicitly expose your application to traffic from the Internet, run the following command:

kubectl expose deployment hello-web --type=LoadBalancer --port 80 --target-port 8080
The kubectl expose command above creates a Service resource, which provides networking and IP support to your application's Pods. GKE creates an external IP and a Load Balancer (subject to billing) for your application.

The --port flag specifies the port number configured on the Load Balancer, and the --target-port flag specifies the port number that is used by the Pod created by the kubectl run command from the previous step.

Note: GKE assigns the external IP address to the Service resource—not the Deployment. If you want to find out the external IP that GKE provisioned for your application, you can inspect the Service with the kubectl get service command:
kubectl get service
Output:
NAME         CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
hello-web    10.3.251.122    203.0.113.0     80:30877/TCP     3d
Once you've determined the external IP address for your application, copy the IP address. Point your browser to this URL (such as http://203.0.113.0) to check if your application is accessible.

Step 7: Scale up your application
You add more replicas to your application's Deployment resource by using the kubectl scale command. To add two additional replicas to your Deployment (for a total of three), run the following command:

kubectl scale deployment hello-web --replicas=3
You can see the new replicas running on your cluster by running the following commands:

kubectl get deployment hello-web
Output:
NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello-web   3         3         3            2           1m
kubectl get pods
Output:
NAME                         READY     STATUS    RESTARTS   AGE
hello-web-4017757401-ntgdb   1/1       Running   0          9s
hello-web-4017757401-pc4j9   1/1       Running   0          9s
hello-web-4017757401-px7tx   1/1       Running   0          1m
Now, you have multiple instances of your application running independently of each other and you can use the kubectl scale command to adjust capacity of your application.

The load balancer you provisioned in the previous step will start routing traffic to these new replicas automatically.

Step 8: Deploy a new version of your app
    GKE's rolling update mechanism ensures that your application remains up and available even as the system replaces instances of your old container image with your new one across all the running replicas.

    You can create an image for the v2 version of your application by building the same source code and tagging it as v2 (or you can change the "Hello, World!" string to "Hello, GKE!" before building the image):

    docker build -t gcr.io/${PROJECT_ID}/hello-app:v2 .
    Then push the image to the Google Container Registry:

    docker push gcr.io/${PROJECT_ID}/hello-app:v2
    Now, apply a rolling update to the existing deployment with an image update:

    kubectl set image deployment/hello-web hello-web=gcr.io/${PROJECT_ID}/hello-app:v2
    Visit your application again at http://[EXTERNAL_IP], and observe the changes you made take effect.

Cleaning up

    To avoid incurring charges to your Google Cloud Platform account for the resources used in this tutorial:

    After completing this tutorial, follow these steps to remove the following resources to prevent unwanted charges incurring on your account:

    Delete the Service: This step will deallocate the Cloud Load Balancer created for your Service:

    kubectl delete service hello-web
    Delete the container cluster: This step will delete the resources that make up the container cluster, such as the compute instances, disks and network resources.

    gcloud container clusters delete hello-cluster

#resource
https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app





