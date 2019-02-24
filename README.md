node moleculer microservice + cloud build + GKE


1. create google project
2. enable cloud build and kubernetes engine api
3. apply kubernetes engine admin role on cloud build on IAM
4. gcloud -> gcloud config set project [PROJECT_ID]
5. create a cluster
  gcloud container clusters create my-cluster \
    --scopes "cloud-platform" \
    --num-nodes 2 \
    --zone us-east1-b
6.Push Docker Image to GCR
  docker build -t gcr.io/gke-node-hello-world/image .
  gcloud docker -- push gcr.io/gke-node-hello-world/image
  (requires to do gcloud auth configure-docker)
7. Create a deployment and service
 kubectl create -f kubernetes-deployment.yaml
 kubectl create -f kubernetes-service.yaml
8. kubectl describe service my-service | grep Ingress
9. Create a new file cloudbuild.yaml
10. Run a Build manually (optional, for verification)
11. Run the cloud build command on your terminal: gcloud builds submit  --config cloudbuild.yaml --substitutions=REVISION_ID=1 .
12 Create a Build Trigger

resources:
https://medium.freecodecamp.org/continuous-deployment-for-node-js-on-google-cloud-platform-751a035a28d5?fbclid=IwAR0Scqpi16z1iDU0UnQukDmwG58XX7HGuDJM2OcuRjDl4QtbUO9jBygwths
https://github.com/gautamarora/gke-node-hello-world
https://github.com/gautamarora/gke-node-hello-world/blob/master/DEPLOY.md#deploy-a-containerized-hello-world-application-to-kubernetes-engine