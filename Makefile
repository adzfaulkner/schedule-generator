IMAGE_TAG_JS=schedule_generator_js

build:
	docker build --tag ${IMAGE_TAG_JS} .

clasp_run_command:
	docker run -it -v ${PWD}:/app -v ${PWD}/root:/root ${IMAGE_TAG_JS} clasp ${cmd}

js_run_command:
	docker run -v ${PWD}:/app ${IMAGE_TAG_JS} ${cmd}

run_tests:
	make js_run_command cmd='npm test'

webpack:
	make js_run_command cmd='npx webpack ${args}'

clasp_login:
	make clasp_run_command args='login'

gas_push:
	make run_tests
	make webpack
	make clasp_run_command cmd='push'

setup:
	make build
	make js_run_command cmd='npm install'

docker_build_tag_push:
	make build
	docker tag ${IMAGE_TAG_JS}:latest ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest
	docker push ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest

docker_pull_image:
	docker pull ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest
	docker tag ghcr.io/adzfaulkner/${IMAGE_TAG_JS}:latest ${IMAGE_TAG_JS}:latest

ci_run_tests:
	make js_run_command cmd='npm install'
	make run_tests

ci_clasp_push:
	make webpack
	make clasp_run_command cmd='push'