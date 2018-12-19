# Kubernetes on Google Cloud Platform
This README describes how to run the Grad Bank App on Kubernetes on Google Cloud Platform.

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
1. Start minikube with `minikube start --vm-driver=hyperv --hyperv-virtual-switch=minikube --v=7 --alsologtostderr`
1. Now it should be configured. If not, have a look at the link above as it provides some extra information.


#### Running Kubernetes locally in Minikube

Assuming you can get Minikube running locally, then run the following commands from the root directory of this repo.

1.  `minikube start --vm-driver=hyperv --hyperv-virtual-switch=minikube --v=7 --alsologtostderr`
1.  `kubectl apply -f k8s`
1.  `minikube ip`

And then you should be able to access the service at the IP address returned from `minikube ip`. 

#### Deploying the App onto Google Cloud Platform

To run it on Google, I used the in build cloud shell and cloned this git repo. Then again I ran `kubectl apply -f k8s` to start the services. However the routing for Google requires some extra setup. These commands did the trick:

1. `curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh`
1. `chmod 700 get_helm.sh`
1. `./get_helm.sh`
1. ` kubectl create serviceaccount --namespace kube-system tiller`
1. `kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller`
1. `helm init --service-account tiller --upgrade`
1.  `helm install stable/nginx-ingress --name my-nginx --set rbac.create=true`
1.  `helm init --service-account tiller --upgrade`


#### Annoying issues

Often when attempting to start or delete minikube, it would provide an error message saying that the `config.json` file cannot be found. There may be better workarounds, but my fix was achieved by following these steps.

1. Disable Hyper-V and restart
1. Go to C:/Users/USERNAME and delete the .minikube directory
1. Turn on Hyper-V and restart
1. 
