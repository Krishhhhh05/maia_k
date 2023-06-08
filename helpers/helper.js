let helper={
    "getResV2": function (success=true, data, error = null, message = "") {
        let res = {success: 0, message: "", data: {}, error: {}};
        if (success) {
            res.success = 1;
        }
        if (data) {
            if (Array.isArray(data) && data.length === 0) {
                res.success = 0;
            }
            res.data = data
        }
        if (message) {
            res.message = message;
        }
        if (error) {
            res.message = error.message;
            res.error = error
        }
        return res
    },
    "getResV3": function ( data,success=true, error = null, message = "") {
        let res = {success: 0, message: "", data: {}, error: {}};
        if (success) {
            res.success = 1;
        }
        if (data) {
            if (Array.isArray(data) && data.length === 0) {
                res.success = 0;
            }
            res.data = data
        }
        if (message) {
            res.message = message;
        }
        if (error) {
            res.success=0;
            res.message = error.message;
            res.error = error
        }
        return res
    },
    getAddressString:(addObj)=>{
        console.log(addObj);
        let addStr='';
        if(addObj.address && addObj.address.length>0){
            addStr+=' '+addObj.address
        }
        if(addObj.locality && addObj.locality.length>0){
            addStr+=', '+addObj.locality
        }
        if(addObj.city && addObj.city.length>0){
            addStr+=', '+addObj.city
        }
        if(addObj.state && addObj.state.length>0){
            addStr+=', '+addObj.state
        }
        if(addObj.country && addObj.country.length>0){
            addStr+=', '+addObj.country
        }
        if(addObj.zipcode && addObj.zipcode.length>0){
            addStr+='- '+addObj.zipcode
        }
        // if(addObj.direction && addObj.direction.length>0){
        //     addStr+='\n '+addObj.direction
        // }
        return addStr
    }


}


module.exports=helper;
