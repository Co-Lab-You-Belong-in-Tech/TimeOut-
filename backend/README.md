# **TimeOut! Backend API Documentation**
 
Welcome to the backend documentation for TimeOut! This API serves as the backend for managing user time logs, goals, and statistics.

## **API Endpoints**

### **User Management**

### 1. Create User

- **Endpoint:** **`POST /api/users`**
- **Description:** Creates a new user or retrieves an existing user.
- **Request Body:**
   
    ```json
    {
      "deviceId": "string",
      "timezone": "string"
    }
    ```
   
- **Response:**
   
    ```json
    {
      "user": {
        "_id": "string",
        "deviceId": "string",
        "timezone": "string",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 2. Get User Details

- **Endpoint:** **`GET /api/users/:id`**
- **Description:** Retrieves details of a user.
- **Response:**
   
    ```json
    {
      "user": {
        "_id": "string",
        "deviceId": "string",
        "timezone": "string",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### **Time Log Management**

### 3. Create Time Log

- **Endpoint:** **`POST /api/timelogs`**
- **Description:** Creates a new time log entry.
- **Request Body:**
   
    ```json
    {
      "userId": "string",
      "date": "string (MM-DD-YYYY)",
      "startTime": "string (HH:MM)",
      "timeSpent": "number"
    }
    ```
   
- **Response:**
   
    ```json
    {
      "date": "formatted date",
      "timelog": {
        "_id": "string",
        "userId": "string",
        "date": "timestamp",
        "startTime": "string",
        "timeSpent": "number",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 4. Update Time Log

- **Endpoint:** **`PUT /api/timelogs/:timelogId`**
- **Description:** Updates an existing time log entry.
- **Request Body:**
   
    ```json
    {
      "timeSpent": "number",
      "startTime": "string (HH:MM AM/PM)"
    }
    ```
   
- **Response:**
   
    ```json
    {
      "timelog": {
        "_id": "string",
        "userId": "string",
        "date": "timestamp",
        "startTime": "string",
        "timeSpent": "number",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 5. Delete Time Log

- **Endpoint:** **`DELETE /api/timelogs/:timelogId`**
- **Description:** Deletes an existing time log entry.
- **Response:**
   
    ```json
    {
      "message": "Timelog deleted successfully"
    }
    ```
   

### 6. Get Time Logs by Date

- **Endpoint:** **`GET /api/timelogs/:userId/:date`**
- **Description:** Retrieves time logs for a specific date.
- **Response:**
   
    ```json
    {
      "timelog": {
        "_id": "string",
        "userId": "string",
        "date": "timestamp",
        "startTime": "string",
        "timeSpent": "number",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 7. Get Time Logs for a User

- **Endpoint:** **`GET /api/timelogs/:userId`**
- **Description:** Retrieves all time logs for a user.
- **Response:**
   
    ```json
    {
      "timeLogs": [
        {
          "_id": "string",
          "userId": "string",
          "date": "timestamp",
          "startTime": "string",
          "timeSpent": "number",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      ]
    }
    ```
   

### 8. Get User's Daily Average

- **Endpoint:** **`GET /api/timelogs/daily-average/:userId`**
- **Description:** Retrieves the overall daily average for a user.
- **Response:**
   
    ```json
    {
      "dailyAverage": "number"
    }
    ```
   

### **Goal Management**

### 9. Create Goal

- **Endpoint:** **`POST /api/goals/create`**
- **Description:** Creates a user's goal for the first time.
- **Request Body:**
   
    ```json
    {
      "userId": "string",
      "type": "string (weekly/monthly)",
      "target": "number"
    }
    ```
   
- **Response:**
   
    ```json
    {
      "goal": {
        "_id": "string",
        "userId": "string",
        "type": "string",
        "target": "number",
        "progress": "number",
        "startDate": "timestamp",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 10. Update Goal

- **Endpoint:** **`PUT /api/goals/update`**
- **Description:** Updates a user's current goal.
- **Request Body:**
   
    ```json
    {
      "userId": "string",
      "type": "string (weekly/monthly)",
      "target": "number"
    }
    ```
   
- **Response:**
   
    ```json
    {
      "currentGoal": {
        "_id": "string",
        "userId": "string",
        "type": "string",
        "target": "number",
        "progress": "number",
        "startDate": "timestamp",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 11. Get User's Current Goal

- **Endpoint:** **`GET /api/goals/current/:userId`**
- **Description:** Retrieves the user's current goal.
- **Response:**
   
    ```json
    {
      "goal": {
        "_id": "string",
        "userId": "string",
        "type": "string",
        "target": "number",
        "progress": "number",
        "startDate": "timestamp",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 12. Save Previous Goal and Create New Goal

- **Endpoint:** **`POST /api/goals/save-and-create-new`**
- **Description:** Saves the previous goal and creates a new goal for the user.
- **Request Body:**
   
    ```json
    {
      "userId": "string",
      "progress": "number"
    }
    ```
   
- **Response:**
   
    ```json
    {
      "previousGoal": {
        "_id": "string",
        "userId": "string",
        "type": "string",
        "target": "number",
        "progress": "number",
        "startDate": "timestamp",
        "endDate": "timestamp",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      },
      "newGoal": {
        "_id": "string",
        "userId": "string",
        "type": "string",
        "target": "number",
        "progress": "number",
        "startDate": "timestamp",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
   

### 13. Get User's Previous Goals

- **Endpoint:** **`GET /api/goals/previous/:userId`**
- **Description:** Retrieves the user's previous goals.
- **Response:**
   
    ```json
    {
      "previousGoals": [
        {
          "_id": "string",
          "userId": "string",
          "type": "string",
          "target": "number",
          "progress": "number",
          "startDate": "timestamp",
          "endDate": "timestamp",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      ]
    }
    ```
   

### **Statistics**

### 14. Get Weekly Stats

- **Endpoint:** **`GET /api/stats/weekly/:userId/:date`**
- **Description:** Retrieves weekly statistics for a user.
- **Response:**
   
    ```json
    {
      "currentWeekStats": [
        {
          "day(eg Sunday)": "string",
          "timeDuration": "number"
        }
      ],
      "previousWeekStats": [
        {
          "day": "string",
          "timeDuration": "number"
        }
      ]
    }
    ```
   

### 15. Get Monthly Stats

- **Endpoint:** **`GET /api/stats/monthly/:userId/:date`**
- **Description:** Retrieves monthly statistics for a user.
- **Response:**
   
    ```json
    {
      "monthlyStats": [
        {
          "day": "number",
          "timeDuration": "number"
        }
      ]
    }
    ```
   

## **Background Process**

### **Goal Scheduler**

The application includes a background process that runs daily to check if it's the end of the week or month for each user. This process is scheduled using the **`node-cron`** library and is located in the **`goal.job.js`** file.

- The scheduler runs every day at midnight.
- For each user, it checks if it's the end of the week or month based on their timezone.
- If it's the end of the week or month, the user's progress for the current week or month is saved, and a new goal is created.

## **Helper Functions**

### **1. `calculateStartDate`**

- **Description:** Calculates the start date based on the goal type (weekly or monthly).
- **Parameters:**
    - **`type`**: Goal type ('weekly' or 'monthly').
    - **`date`**: Optional parameter to calculate the start date based on a specific date.

### **2. `updateGoalProgress`**

- **Description:** Updates the user's goal progress based on an array of time logs.
- **Parameters:**
    - **`userId`**: User ID.
    - **`date`**: The date until which the progress needs to be updated.

### **3. `calculateWeeklyProgress`**

- **Description:** Calculates progress for a weekly goal.
- **Parameters:**
    - **`userId`**: User ID.
    - **`startDate`**: Start date of the goal period.
    - **`endDate`**: End date of the goal period.

### **4. `calculateMonthlyProgress`**

- **Description:** Calculates progress for a monthly goal.
- **Parameters:**
    - **`userId`**: User ID.
    - **`startDate`**: Start date of the goal period.
    - **`endDate`**: End date of the goal period.

### **5. `handleGoalTypeChange`**

- **Description:** Handles goal type changes without losing data.
- **Parameters:**
    - **`currentGoal`**: Current goal object.
    - **`userId`**: User ID.
    - **`newType`**: New goal type ('weekly' or 'monthly').
    - **`target`**: New goal target.