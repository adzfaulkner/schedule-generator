# Dev setup

Ensure you have docker installed on your machine!

1: Clone this repo
2: Change into the newly cloned directory ie `cd ./schedule-generator`
3: Execute `make setup` to create the necessary docker image(s)
4: To ensure everything is up and running as it should, execute `make run_tests`

## Clasp set up

To be able to push code to Google Apps, go through the following steps:

1: Execute `make clasp_login`
2: Copy the URL that's featured in terminal output into browser and go through the wizard (n.b select all on Select what clasp – The Apps Script CLI can access)
3: On the final step, you will receive a 404. This is because the login command featured in point 1 allocated a random port is not exposed in the container so the following workaround is required:
1: In a separate terminal window, execute `docker ps` and obtain the container id of the process that is running the app_script_js image.
2: Once obtained, execute the following command: `docker exec -it %container_id% wget %browser url that resulted in 404%`
3: Execute `cp clasp.sample.json clasp.json` and replace the script id with the scripts id feature in Sheets > Extensions > App Script URL id
4: Make code changes and execute `make clasp_push` to push code to GAS

# Push to new schedule TBC

1: Overwrite the script id in file `.clasp.json` with the new sheet project id (ie open up App script in browser)
2: Add onChange trigger to execute function onChange
