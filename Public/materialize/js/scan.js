
function scanCoDong() {
    $("#scanbarcode").keypress(function (e) {

        if (e.which === 13) {
            var barcode = this.value
            if(barcode.includes('U')) {
                alert('Không phải thư mời')
                $(this).val('')
                return false 
            }
            $.ajax({
                type: "get",
                url: './ajax/ma-co-dong',
                data: {
                    barcode: barcode,
                },
                dataType: 'json',
                beforeSend: function () {
                    // $('.modal-trigger').click()
                },
                success: function (data) {
                    
                    try {
                        const macodong = data[0].ID
                        const codong = data[0].Ten_Co_Dong
                        const sophieu = data[0].CP_Tong
                        
                        var tong = 0
                    if ($('[name="id"]').length <= 0) {
                        var content = `<tr><td><input type="text" name="id" value="${macodong}" style="border:none;"/></td>`
                        content += `<td>${codong}</td><td>${sophieu}</td></tr>`
                        $('#check-data').append(content)
                    }else{
                        $('[name="id"]').each((e,r) => {
                            if(r.value !== macodong){
                                var content = `<tr><td><input type="text" name="id" value="${macodong}" style="border:none;"/></td>`
                                content += `<td>${codong}</td><td>${sophieu}</td></tr>`
                                $('#check-data').append(content)
                            }
                        })
                    }
                    $('#check-data').find('tr').each( (e,i) => {
                        tong +=new  Number($(i).find('td:eq(2)').text())
                    })
                    $("#CP_Tong").html(tong)
                    return data
                        } catch (error) {
                           alert('Phiếu đã check in')
                           $('#scanbarcode').val('')
                        }
                },
                complete: function (res) {
                    const codong = res.responseJSON[0].Ten_Co_Dong
                    const cmnd = res.responseJSON[0].So_DKNSH
                    $('#scanbarcode').val('').attr('readonly',true)
                    $('[name="Ten_Dai_Bieu"]').val(codong)
                    $('[name="CMND"]').val(cmnd)
                    $('.loading').css({ 'color': "#008000" }).html("Thành công")
                    $('#scanuyquyen').focus()
                    M.updateTextFields();                    
                },
                error: function () {
                    $('#scanbarcode').val('')
                    $('.loading').css({ 'color': "red" }).html("Lỗi")
                }

            })
        }
    })
    // ủy quyền
    $('#scanuyquyen').keypress(function (e){
        if (e.which === 13) {
            var barcode = this.value
            if(!barcode.includes('U')) {
                alert('Không phải giấy ủy quyền')
                $(this).val('')
                return false 
            }
            $.ajax({
                type: "get",
                url: './ajax/ma-uy-quyen',
                data: {
                    barcode: barcode
                },
                dataType: 'json',
                beforeSend: function () {
                    // $('.modal-trigger').click()
                },
                success: function (data) {
                    try {
                        const macodong = data[0].ID
                        const codong = data[0].Ten_Co_Dong
                        const sophieu = data[0].CP_Tong
                        
                        var tong = 0
                    if ($('input[name="id"]').length > 0) {
                        console.log($('input[name="id"]').val())
                        const check = []
                        $('input[name="id"]').each((e,r) => {
                            check.push(r.value)
                        })
                        if(!check.includes(macodong)){
                            var content = `<tr><td><input type="text" name="id" value="${macodong}" style="border:none;"/></td>`
                            content += `<td>${codong}</td><td>${sophieu}</td></tr>`
                            $('#check-data').append(content)
                        }
                    }else{
                        var content = `<tr><td><input type="text" name="id" value="${macodong}" style="border:none;"/></td>`
                        content += `<td>${codong}</td><td>${sophieu}</td></tr>`
                        $('#check-data').append(content)
                    }
                    $('#check-data').find('tr').each( (e,i) => {
                        tong +=new  Number($(i).find('td:eq(2)').text())
                    })
                    $("#CP_Tong").html(tong)
                    return data
                        } catch (error) {
                            // $('#scanbarcode').val('')
                        }
                },
                complete: function (res) {
                    $('#scanbarcode').val('').attr('readonly',true)
                    $('#scanuyquyen').val('')
                    $('.loading').css({ 'color': "#008000" }).html("Thành công")
                    $('#scanuyquyen').focus()
                    M.updateTextFields();                    
                },
                error: function () {
                    $('#scanuyquyen').val('')
                    $('.loading').css({ 'color': "red" }).html("Lỗi")
                }

            })
        }
    })
    // từ xa
    $("#offline").keypress(function (e) {
        if (e.which === 13) {
            var barcode = this.value
            if(barcode.includes('U')) {
                alert('Không phải thư mời')
                $(this).val('')
                return false 
            }
            $.ajax({
                type: "get",
                url: './ajax/ma-co-dong',
                data: {
                    barcode: barcode,
                },
                dataType: 'json',
                beforeSend: function () {
                    // $('.modal-trigger').click()
                },
                success: function (data) {
                    
                    try {
                        const macodong = data[0].ID
                        const codong = data[0].Ten_Co_Dong
                        const sophieu = data[0].CP_Tong
                        
                        var tong = 0
                    if ($('[name="id"]').length <= 0) {
                        var content = `<tr><td><input type="text" name="id" value="${macodong}" style="border:none;"/></td>`
                        content += `<td>${codong}</td><td>${sophieu}</td></tr>`
                        $('#check-data').append(content)
                    }else{
                        $('[name="id"]').each((e,r) => {
                            if(r.value !== macodong){
                                var content = `<tr><td><input type="text" name="id" value="${macodong}" style="border:none;"/></td>`
                                content += `<td>${codong}</td><td>${sophieu}</td></tr>`
                                $('#check-data').append(content)
                            }
                        })
                    }
                    $('#check-data').find('tr').each( (e,i) => {
                        tong +=new  Number($(i).find('td:eq(2)').text())
                    })
                    $("#CP_Tong").html(tong)
                    return data
                        } catch (error) {
                           alert('Phiếu đã check in')
                           $('#scanbarcode').val('')
                        }
                },
                complete: function (res) {
                    const codong = res.responseJSON[0].Ten_Co_Dong
                    const cmnd = res.responseJSON[0].So_DKNSH
                    $('#scanbarcode').val('').attr('readonly',true)
                    $('#scanuyquyen').val('').attr('readonly',true)
                    $('#offline').val('').attr('readonly',true)
                    $('[name="Ten_Dai_Bieu"]').val(codong)
                    $('[name="CMND"]').val(cmnd)
                    $('.loading').css({ 'color': "#008000" }).html("Thành công")
                    $('#scanuyquyen').focus()
                    M.updateTextFields();                    
                },
                error: function () {
                    $('#scanbarcode').val('')
                    $('.loading').css({ 'color': "red" }).html("Lỗi")
                }

            })
        }
    })
    $('.locked').click(function(){
        event.preventDefault()
        const id = $(this).data('action')
        $.ajax({
            type:'get',
            url:'../admin/ajax/chot-cau-hoi',
            data:{
                id:id
            },
            success:function(data){
                window.location.reload()
            }
        })
    })
}
function ScanBieuQuyet(){
    $("#tanthanh").keypress(function(e){
        if(e.which == 13){
            const madaibieu = this.value
            const url = window.location.href
            $.ajax({
                type:'post',
                url:url,
                data:{
                    Ma_Dai_Bieu:madaibieu,
                    options:1
                },
                beforeSend: function () {
                    $('.modal-trigger').click()
                },
                success:function(data){
                    $("#tbl-tanthanh").DataTable().ajax.reload()
                    M.toast({html: 'Success!', classes: 'rounded'});
                },
                complete:function(){
                    $('#tanthanh').val('')
                    var instance = M.Modal.getInstance($('.modal'));
                    instance.close();
                   
                },
                error:function(){
                    M.toast({html: 'Errors!', classes: 'rounded'});
                }
            })
        }
    })

    $("#khongtanthanh").keypress(function(e){
        if(e.which == 13){
            const madaibieu = this.value
            const url = window.location.href
            $.ajax({
                type:'post',
                url:url,
                data:{
                    Ma_Dai_Bieu:madaibieu,
                    options:0
                },
                success:function(data){
                    $("#tbl-khongtanthanh").DataTable().ajax.reload()  
                    M.toast({html: 'Success!', classes: 'rounded'});
                },
                complete:function(){
                    $('#khongtanthanh').val('')
                    var instance = M.Modal.getInstance($('.modal'));
                    instance.close();
                    
                },
                error:function(){
                    M.toast({html: 'Errors!', classes: 'rounded'});
                }
            })
        }
    })
}