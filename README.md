# Kubernetes
Run the Grad App on Kubernetes

If you have Minikube working locally, then you can be in the root directory and run:

1.  `minikube start`
1.  `kubectl apply -f k8s`
1.  `minikube ip`

And then you should be able to access the service at the IP address returned from `minikube ip`
