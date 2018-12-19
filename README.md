# Kubernetes
Run the Grad App on Kubernetes

If you have Minikube working locally, then you can be in the root directory and run:

1.  `minikube start`
1.  `kubectl apply -f k8s`
1.  `minikube ip`

And then you should be able to access the service at the IP address returned from `minikube ip`


I found https://learnk8s.io/blog/installing-docker-and-kubernetes-on-windows extremely useful for getting Minikube set up locally on Windows - could usually only ever get it running when starting it in debug mode.

To run it on Google, I used the in build cloud shell and cloned this git repo. Then again I ran `kubectl apply -f k8s` to start the services. However the routing for Google requires some extra setup. These commands did the trick:

1. `curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh`
1. `chmod 700 get_helm.sh`
1. `./get_helm.sh`
1. ` kubectl create serviceaccount --namespace kube-system tiller`
1. `kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller`
1. `helm init --service-account tiller --upgrade`
1.  `helm install stable/nginx-ingress --name my-nginx --set rbac.create=true`
1.  `helm init --service-account tiller --upgrade`