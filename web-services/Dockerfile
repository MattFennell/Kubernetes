FROM openjdk:11

ENV JWT_SECRET="FLKnfsalkfnaslfsanlfsaknfsalknfsalnafslsafnfsalknfsalkfanlafsnafslnafslnfaslafsnfalsknafslfasnlfasnafslk"
WORKDIR /grad-bank-app
VOLUME /grad-bank-app/resources
COPY ./build/libs/Grad-bank-app-*.jar app.jar
COPY ./build/resources/main/application.properties resources/application.properties
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/grad-bank-app/app.jar"]
