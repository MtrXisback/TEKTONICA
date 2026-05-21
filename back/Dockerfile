# Etapa 1: Compilación usando el ejecutable Wrapper nativo de tu back
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiamos la estructura del empaquetador Maven nativo
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Descargamos dependencias offline para cachear capas y acelerar builds futuros
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Inyectamos el código fuente y compilamos el archivo .jar ejecutable
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Contenedor ligero JRE de producción (Ultra-blindado y rápido)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]