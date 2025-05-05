# YouTube Clone Backend

A Spring Boot application that provides the backend APIs for the YouTube clone application.

## Technology Stack

- **Java 22**
- **Spring Boot 3.2.5**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** as the database
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code
- **JUnit** and **Mockito** for testing

## Features

- User registration and authentication with JWT
- Video upload, storage, and retrieval
- Video metadata management
- User subscriptions
- Video comments
- Like/dislike functionality
- Search capabilities
- User profile management

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── youtube/
│   │   │           └── clone/
│   │   │               └── backend/
│   │   │                   ├── controllers/    # REST API endpoints
│   │   │                   ├── model/          # Entity classes
│   │   │                   ├── repository/     # Data access interfaces
│   │   │                   ├── service/        # Business logic
│   │   │                   ├── security/       # Authentication and authorization
│   │   │                   ├── exception/      # Exception handling
│   │   │                   ├── config/         # Configuration classes
│   │   │                   ├── payload/        # Request/Response objects
│   │   │                   └── BackendApplication.java
│   │   └── resources/
│   │       ├── application.properties  # Application configuration
│   │       └── static/                 # Static resources
│   └── test/                           # Unit and integration tests
├── pom.xml                             # Dependencies and build configuration
└── uploads/                            # Directory for uploaded videos
```

## Getting Started

### Prerequisites

- Java 22
- Maven
- MySQL

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/youtube-clone.git
   cd youtube-clone/backend
   ```

2. Configure MySQL database:
   - Create a MySQL database named `youtube_clone`
   - Update `application.properties` with your MySQL username and password

3. Build the application:
   ```
   mvn clean install
   ```

4. Run the application:
   ```
   mvn spring-boot:run
   ```

The server will start on port 8080 by default.

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Authenticate and get JWT token

### Video Endpoints

- `POST /api/videos` - Upload a new video
- `GET /api/videos` - Get all videos
- `GET /api/videos/{id}` - Get video by ID
- `PUT /api/videos/{id}` - Update video
- `DELETE /api/videos/{id}` - Delete video

### User Endpoints

- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update user profile
- `GET /api/users/{id}/videos` - Get videos uploaded by user

### Subscription Endpoints

- `POST /api/subscriptions` - Subscribe to a channel
- `DELETE /api/subscriptions/{id}` - Unsubscribe
- `GET /api/users/{id}/subscribers` - Get channel subscribers
- `GET /api/users/{id}/subscriptions` - Get user subscriptions

## Environment Configuration

The application can be configured using environment variables or by updating the `application.properties` file:

```
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/youtube_clone
spring.datasource.username=root
spring.datasource.password=password

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# File Upload Configuration
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# JWT Configuration
app.jwtSecret=your-secret-key
app.jwtExpirationMs=86400000
```

## Deployment

The application can be deployed as a JAR file:

```
mvn package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## Testing

Run the tests with:

```
mvn test
``` 