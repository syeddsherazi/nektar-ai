# nektar-ai

NODE BACKEND TASK FOR NEKTAR AI

Installation and Run Steps:

- You need to node installed on your local machine
- Clone the repo, and do npm installation by running => npm i
- Start project => node app.js
- Server will run on port 3003
- The endpoint to hit is http://localhost:3003/logs
- Query params are startDate(optional), endDate(optional), pageNo(optional)
- API response contains following
  1. count ( count of returned items )
  2. logs (array of objects with keys date & log)
- Static folder is the location to place the file example.txt for tests. Have placed a file there, you can replace it.
- Have added details of all implementation, params etc in comments alongside code
