# Calasu Microservice

A microservice based architecture for social media platform where user can connect with each other and share posts.

## Goal:
Goal was to build a real world social media platform which can be highly scalable and reliable while maintaining a very low latency.

## Primary features:
  - write article/blog
  - share photos
  - like/unlike posts
  - follow/unfollow user
  
## Technology used:
  - Nodejs
  - Expressjs
  - gRPC
  - JSONWebToken
  - Redis
  - PostgreSQL
  - Apache Cassaandra
  - Amazon SQS
  - AWS S3
  - Amazon SNS
  - Google Auth
  
## Services
  ##### Total Number of Services: 07
  
  #### API Gateway:
    - single entry point to the sytem
    - responsible for authorization of requests
    - route requests to the other services
  
  #### Auth service:
    - handle user's authentication
    
  #### Follow service:
    - handle user connections
    
  #### Like service:
    - manages user likings
    
  #### News feed service:
    - generate users's news feed
    
  #### Post service:
    - handle user's posts
    
  #### Profile service:
    - manages user's profile
