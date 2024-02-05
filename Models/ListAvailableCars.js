const {CarModel}=require("./CarModel")

const FindListCars=async(newdata,bookeddata,bookingDetails,props,status)=>
{
    const {startdate,dropdate,startmonth,dropmonth,startyear,dropyear}=props

    const listDetail=await CarModel.find({car_no:bookingDetails.car_no}).select({list_start:1,list_drop:1,car_no:1})
    // console.log(listDetail)

    var liststartdate=Number(listDetail[0].list_start.split("-")[2]);
    var listdropdate=Number(listDetail[0].list_drop.split("-")[2]);
    var liststartmonth=Number(listDetail[0].list_start.split("-")[1]);
    var listdropmonth=Number(listDetail[0].list_drop.split("-")[1])
    var liststartyear=Number(listDetail[0].list_start.split("-")[0])
    var listdropyear=Number(listDetail[0].list_drop.split("-")[0])

    if(startyear===liststartyear && dropyear===listdropyear && startyear===dropyear)
    {

        if(startmonth===dropmonth && startmonth===liststartmonth && dropmonth===listdropmonth)
        {
            if(liststartdate<=startdate && startdate<=listdropdate && dropdate<=listdropdate)
            {

                // console.log("Pushed",bookingDetails.car_no)
                newdata.push(bookingDetails.car_no)
                // console.log("New",newdata)
            }
        }
        else if((liststartmonth===startmonth) && (startmonth===listdropmonth-1))
        {
            if(startmonth===liststartmonth && dropmonth===listdropmonth)
            {
                if(startdate>=liststartdate && dropdate<=listdropdate)
                {
                    newdata.push(bookingDetails.car_no)

                }
            }
            else if(startmonth===liststartmonth && dropmonth===liststartmonth)
            {
                if(startdate>=liststartdate && dropdate>=liststartdate)
                {
                    newdata.push(bookingDetails.car_no)
                }
            }
        }
        else if((liststartmonth===startmonth-1) && (listdropmonth===startmonth && listdropmonth===dropmonth))
        {
            if((startdate<=listdropdate && dropdate<=listdropdate))
            {
                newdata.push(bookingDetails.car_no)
            }
        }
        else
        {
            if(Math.abs(liststartmonth-listdropmonth)>1)
            {
                if(startmonth>=liststartmonth && dropmonth<=listdropmonth && startmonth<=listdropmonth)
                {
                    newdata.push(bookingDetails.car_no)
                }
            }
        }
    } 
    else if(startyear===liststartyear && dropyear===listdropyear)
    {
        console.log("Enetred diff")
        if(liststartdate<=startdate && listdropdate>=dropdate)
        {
            newdata.push(bookingDetails.car_no)

        }
        else if(liststartdate>=startdate && dropdate>=listdropdate)
        {
            newdata.push(bookingDetails.car_no)

        }
        else if(startdate<=liststartdate && dropdate<=listdropdate)
        {
            newdata.push(bookingDetails.car_no)

        }
    }
   
    if(status==="BookedChecking" )
    {
        // return {newdata,bookeddata}
    }
    else
    {
        return {newdata,bookeddata}

    }

}

module.exports={FindListCars}