module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var options = [
        'ג - Gimmel',
        'ה - Hay',
        'ש - Shin',
        'נ - Nun'
    ];
    var number = Math.floor(Math.random() * 3);

    context.res = {
        body: options[number]
    };
};