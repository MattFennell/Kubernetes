# Kubernetes on Google Cloud Platform
This README describes how to run the Grad Bank App using Kubernetes on Google Cloud Platform as well as locally with Minikube.

#### Building the docker images
Inside the `web-services` directory, run the following, replacing `username` with your docker username. This should build the Client and Service images, and then push them to DockerHub. There are more instructions for pushing images to DockerHub at https://hackernoon.com/publish-your-docker-image-to-docker-hub-10b826793faf

  1. `docker build -t username/web-services:latest --network=host .`
  1. `docker push username/web-services:latest`
Inside the `web-ui` directory, run the following, again replacing `username` with your docker username
  1. `docker build -t username/web-ui:latest .`
  1. `docker push username/web-ui:latest`  
  
#### Setting up Minikube locally
This was a bit tricky to sort, but these are some helpers. You may need to go into the BIOS to enable Virtualisation, and you will need to enable HyperV in Windows. I essentially just followed the steps in https://learnk8s.io/blog/installing-docker-and-kubernetes-on-windows, but below is a condensed version of them (I think).

1. Start cmd.exe as admin
1. Install Chocolatey by executing `@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"`
1. Install docker - `choco install docker-for-windows -y`. You may need to restart laptop and enable Hyper-V
1. This should return an empty list if it's working `docker ps`
1. Install minikube - `choco install minikube -y`
1. Open Powershell as admin
1. Run `Get-NetAdapter`
1. Execute `New-VMSwitch –Name "minikube" –AllowManagement $True –NetAdapterName "INSERT_HERE_ADAPTER"` but enter in the correct adapter based of the names of the network adapters. I used `Ethernet`.
1. From a Git Bash terminal with Admin privileges run `minikube start --vm-driver=hyperv --hyperv-virtual-switch=minikube --v=7 --alsologtostderr`
1. Now it should be configured. If not, have a look at the link above as it provides some extra information. If it's running correctly, `minikube status` should result in seeing
  - `host: Running`
  - `kubelet: Running`
  - `apiserver: Running`
  - `kubectl: Correctly Configured: pointing to minikube-vm at XXX`


#### Running Kubernetes locally in Minikube
Assuming you can get Minikube running locally, then run the following commands from the root directory of this repo from a Git Bash terminal with Admin privileges. 

1.  `minikube start --vm-driver=hyperv --hyperv-virtual-switch=minikube --v=7 --alsologtostderr`
1.  `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml`
1.  `minikube addons enable ingress`
1.  `kubectl apply -f k8s` (Should see several types of files being created)
1.  `minikube ip`

And then you should be able to access the service at the IP address returned from `minikube ip`. To check that it's working, running `kubectl get pods` and you should see the client, server and sql deployments and their status. It may take a minute or two for the pods to load up. For more information about a pod, run `kubectl logs POD-NAME`.

#### Deploying the App onto Google Cloud Platform

First you will need to create an account and set up a billing method. With Google Cloud Platform you get £237.51 worth of usage for free to be used within a year (just remember to shut down all clusters once finished). 

##### Creating the Cluster
1. Go to the Kubernetes Engine page and click `Create cluster`
1. Name it as you like. 
1. Location type = `Zonal`
1. Zone = `europe-west1-b`
1. Master version = `1.10.9-gke.5`
1. Number of nodes = 1
1. Machine type = `2 vCPU` (Necessary or you'll run out of CPU)
1. Click create and wait a few minutes for it to be created (may need to refresh page)


#### Applying the config files
To run it on Google, I used the in built cloud shell and cloned this git repo. Then again I ran `kubectl apply -f k8s` to start the services. However the routing for Google requires some extra setup. Following these steps should deploy the app:

1. Once the cluster has been created, click the connect button on the right and then click `Run in Cloud Shell`.
1. Press enter to run the auto generated command
1. `git clone https://github.com/MattFennell/Kubernetes.git`
1. `cd Kubernetes/`
1. `curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh`
1. `chmod 700 get_helm.sh`
1. `./get_helm.sh`
1. `kubectl create serviceaccount --namespace kube-system tiller`
1. `kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller`
1. `helm init --service-account tiller --upgrade`
1.  `helm install stable/nginx-ingress --name my-nginx --set rbac.create=true` (May need to type this one out)
1. `kubectl apply -f k8s`
1. `kubectl get pods` should tell inform you if the pods are running or are pending
1. Go to the `Services` tab on the left
1. Click the endpoint for the row named `my-nginx-nginx-ingress-controller` and it the application should open. 

If there seems to be an error, investigate the logs of the services through the CLI with kubectl, or have a look at the `workloads` tab on the left. It may say that there is not enough CPU available in which case you'll need to recreate the cluster, allocating more CPU. To stop all services, go to the `Clusters` tab on the left and delete the cluster.

#### Issues encountered
Often when attempting to start or delete minikube, it would provide an error message saying that the `config.json` file cannot be found. There may be better workarounds, but my fix was achieved by following these steps.

1. Disable Hyper-V and restart
1. Go to C:/Users/USERNAME and delete the .minikube directory
1. Turn on Hyper-V and restart
1. Open Hyper-V manager and click Virtual Switch Manager on the right
1. Remove the minikube switch
1. Open Powershell as admin
1. Run `New-VMSwitch –Name "minikube" –AllowManagement $True –NetAdapterName "INSERT_HERE_ADAPTER"` as before, replacing the NetAdapterName
1. Open Git Bash as admin and run `minikube start --vm-driver=hyperv --hyperv-virtual-switch=minikube --v=7 --alsologtostderr
`

