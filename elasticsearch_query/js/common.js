function requestAjax(options)
{
    return $.ajax({
        type: options.method,
        url: options.url,
        headers: options.headers,
        data: options.param,
        dataType: "json",
        contentType: "application/json",
        success : options.success,
        error : options.error,
        complete : options.complete
    });
}