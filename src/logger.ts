export default (msg: any, type: string = 'info') => {
    var file:string = '';
    var o:any = new Error();
        o.stack.split("\n").forEach((line: string, i: number) => {
        if(i == 2){
            var parts: string[] = line.split('(');
            var str: string = parts[parts.length -1];
            file = str.substring(0, str.length - 1);
        }
    });

    console.log('\x1b[36m%s\x1b[0m', 'LOG:'+type+' ('+typeof msg+') at: '+file);
    console.log(msg);
}