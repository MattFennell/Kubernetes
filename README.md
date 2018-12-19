# Kubernetes
Run the Grad App on Kubernetes

If you have Minikube working locally, then you can be in the root directory and run:

1.  `minikube start`
1.  `kubectl apply -f k8s`
1.  `minikube ip`

And then you should be able to access the service at the IP address returned from `minikube ip`


I found https://learnk8s.io/blog/installing-docker-and-kubernetes-on-windows extremely useful for getting Minikube set up locally on Windows - could usually only ever get it running when starting it in debug mode
