import { AmplifyDDBResourceTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyDDBResourceTemplate) {
    resources.dynamoDBTable.addPropertyOverride("TimeToLiveSpecification", {
        "AttributeName" : "ExpirationTime",
        "Enabled" : true
    });
}
