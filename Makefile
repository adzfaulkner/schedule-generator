IMAGE_TAG_JS=app_script_js

build:
	docker build --tag ${IMAGE_TAG_JS} .

clasp_run_command:
	docker run -it -v ${PWD}:/app -v ${PWD}/root:/root ${IMAGE_TAG_JS} clasp ${cmd}

js_run_command:
	docker run -v ${PWD}:/app ${IMAGE_TAG_JS} ${cmd}

run_tests:
	make js_run_command cmd='npm test'

clasp_login:
	make clasp_run_command args='login'

clasp_push:
	make run_tests
	make clasp_run_command cmd='push'

setup:
	make build
	make js_run_command cmd='npm install'