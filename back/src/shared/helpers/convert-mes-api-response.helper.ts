function getResultString(mes_response: string): string {
  return mes_response.split('],{RESULT:[')[1].replace(']}', '').replace('MES_OK:', '');
}

export function convertMesApiResponse(mes_response: string): Object | string {
    const result_string = getResultString(mes_response);

    if(!result_string.includes(':')) return result_string;
    
    const result_array = result_string.split(',');
  
    const array_of_objects = result_array.map((value) => {
    const key_value_pair = value.split(':')
    
        return {
        [key_value_pair[0]]: key_value_pair[1]
        }
    });
      
    return Object.assign({}, ...array_of_objects);
}

export function hasErrorOnMesApiResponse(converted_mes_response: Object | string): boolean {
  return Object.keys(converted_mes_response)[0] === "MES_ERROR";
}