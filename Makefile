IMAGE_TAG_JS=schedule_generator_js

build:
	docker build --tag ${IMAGE_TAG_JS} .

clasp_run_command:
	docker run -v ${PWD}:/app -v ${PWD}/root:/root ${IMAGE_TAG_JS} clasp ${cmd}

js_run_command:
	docker run -v ${PWD}:/app ${IMAGE_TAG_JS} ${cmd}

npm_install:
	make js_run_command cmd='npm install ${args}'

run_tests:
	make js_run_command cmd='npm test'

clasp_login:
	make clasp_run_command args='login'

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

gas_push:
	make js_run_command cmd='npm test && npm run build'
	make clasp_run_command cmd='push'