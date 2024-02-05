const {FindListCars}=require("./ListAvailableCars")
const findAvailableCars=async(bookingDetails,props)=>
{
    const {startdate,dropdate,startmonth,dropmonth,startyear,dropyear}=props
    const newdata=[]
    const bookeddata=[]
    var flag=0

    for(i=0;i<bookingDetails.length;i++)
    {
        var bookedstartdate=Number(bookingDetails[i].start_date.split("-")[2]);
        var bookeddropdate=Number(bookingDetails[i].drop_date.split("-")[2]);
        var bookedstartmonth=Number(bookingDetails[i].start_date.split("-")[1]);
        var bookeddropmonth=Number(bookingDetails[i].drop_date.split("-")[1])
        var bookedstartyear=Number(bookingDetails[i].start_date.split("-")[0])
        var bookeddropyear=Number(bookingDetails[i].drop_date.split("-")[0])

        
        if(startyear===bookedstartyear && dropyear===bookeddropyear && startyear===dropyear)
        {

            if(startmonth===dropmonth && startmonth===bookedstartmonth && dropmonth===bookeddropmonth)
            {
                if(bookedstartdate<=startdate && startdate<=bookeddropdate)
                {
                    flag=1;
                }
                else if(bookedstartdate<=dropdate && dropdate<=bookeddropdate)
                {
                    flag=1;
                }
                else if(bookedstartdate>=startdate && bookeddropdate<=dropdate)
                {
                    flag=1;
                }
            }
            else if((bookedstartmonth===startmonth) && (startmonth===bookeddropmonth-1))
            {
                if(startmonth===bookedstartmonth && dropmonth===bookeddropmonth)
                {
                    if(startdate>=bookedstartdate && dropdate<=bookeddropdate)
                    {
                        flag=1
                    }
                    else if(startdate<=bookedstartdate && dropdate>=bookeddropdate)
                    {
                        flag=1
                    }
                    else if(startdate>=bookedstartdate && dropdate>=bookeddropdate)
                    {
                        flag=1
                    }
                }
                else if(startmonth===bookedstartmonth && dropmonth===bookedstartmonth)
                {
                    if(startdate<=bookedstartdate && dropdate>=bookedstartdate)
                    {
                        flag=1
                    }
                    else if(startdate>=bookedstartdate && dropdate>=bookedstartdate)
                    {
                        flag=1
                    }
                }
            }
            else if(((bookedstartmonth===startmonth-1) && (bookeddropmonth===startmonth && bookeddropmonth===dropmonth)) || ((bookedstartmonth===startmonth) && (dropmonth===bookedstartmonth+1)) )
            {
                if(startdate<=bookeddropdate || (startdate<=bookeddropdate && dropdate<=bookeddropdate))
                {
                    flag=1
                }
            }
            else if(bookedstartmonth<=startmonth && bookeddropmonth>=dropmonth)
            {
                flag=1
            }
         
        } 
        else if(startyear===bookedstartyear && dropyear===bookeddropyear)
        {
            console.log("Enetred diff")
            if(bookedstartdate<=startdate && bookeddropdate>=dropdate)
            {
                flag=1
            }
            else if(bookedstartdate>=startdate && dropdate>=bookeddropdate)
            {
                flag=1
            }
            else if(startdate<=bookedstartdate && dropdate<=bookeddropdate)
            {
                flag=1
            }
        }

        if(flag==1)
        {
            flag=0;
            bookeddata.push(bookingDetails[i].car_no)
            if(newdata.includes(bookingDetails[i].car_no))
            {
                newdata.splice(newdata.indexOf(bookingDetails[i].car_no),1)
            }
        }
        else
        { 

            if(!newdata.includes(bookingDetails[i].car_no) && !bookeddata.includes(bookingDetails[i].car_no))
            {
                console.log('came')
                await FindListCars(newdata,bookeddata,bookingDetails[i],{startdate,dropdate,startmonth,dropmonth,startyear,dropyear},"BookedChecking")
                flag=0;
                // newdata.push(bookingDetails[i].car_no)
                // console.log(newdata)
 
        }
    }  
} 
    return {newdata,bookeddata}

}

module.exports={findAvailableCars}