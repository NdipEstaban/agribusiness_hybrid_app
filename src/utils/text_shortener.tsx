const textShortener = (text:string, length:number = 95) => {
    return text.split('').slice(0,length).join('')+'...';
}

export default textShortener;