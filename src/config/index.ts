import merge from 'lodash.merge';


export default (async () => {
    process.env.NODE_ENV ||= 'development';

    const stage = process.env.STAGE || 'local';
    const stages: any = {
        production: 'production',
        local: 'local',
        staging: 'staging',
        default: 'local'
    };
    const envConfig = (await import((<string>stages[stage]) || stages.default)).default;
    return merge({}, envConfig);
})();
