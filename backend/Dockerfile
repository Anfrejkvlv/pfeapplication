# Phase de build Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Image finale JRE
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/pfeapplication-0.0.1-exec.jar ./app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]


#ENTRYPOINT ["top", "-b"]