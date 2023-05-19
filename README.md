[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jwkaterina_meetup&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jwkaterina_meetup) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jwkaterina_meetup&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jwkaterina_meetup)

# Project Development

## Templating Engine
This project uses [Handlebars](https://handlebarsjs.com) templates to construct complex html.

See [Examples](https://github.com/pcardune/handlebars-loader/tree/main/examples) how to use it.

## Git
Use [Semantic Commit Messages](https://nitayneeman.com/posts/understanding-semantic-commit-messages-using-git-and-angular/)

## Run the app locally
In order to call backend from `localhost` in your chrome browser use [block-insecure-private-network-requests](https://stackoverflow.com/a/66555660) in `chrome://flags/` and enable `Allow invalid certificates for resources loaded from localhost`.

## Code Quality
## Testing
Put all your tests under `./test` folder.
### VSCode
To run the tests from within your VSCode editor install [vscode-jest-runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) extension.

To code quality checks install [SonarLint](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) extension.
