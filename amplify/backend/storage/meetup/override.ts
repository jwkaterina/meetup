import { AmplifyDDBResourceTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyDDBResourceTemplate) {
    resources.dynamoDBTable.addPropertyOverride("TimeToLiveSpecification", {
        "AttributeName" : "ExpirationTime",
        "Enabled" : true
    });

    resources.dynamoDBTable.addPropertyOverride("StreamSpecification", {
        "StreamViewType" : "NEW_AND_OLD_IMAGES"
    });
}
