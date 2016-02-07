console.log('Loading function');

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    if (typeof event.name !== 'undefined') {
        context.succeed(event.name);
    } else {
        context.fail('"name" must be supplied');
    }
};
