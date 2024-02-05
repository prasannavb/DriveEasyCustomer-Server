const ExtendTripCars=async(bookingDetails,props,uid)=>
{
    const {startdate,dropdate,startmonth,dropmonth,startyear,dropyear}=props
    var flag=0
    var bookeddata=[]
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
                        flag=1                    
                    }
                    else if(bookedstartdate<=dropdate && dropdate<=bookeddropdate)
                    {
                        flag=1                  
                    }
                    else if(bookedstartdate>=startdate && bookeddropdate<=dropdate)
                    {
                        flag=1                    
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
                else if((bookedstartmonth===startmonth-1) && (bookeddropmonth===startmonth && bookeddropmonth===dropmonth))
                {
                    if(startdate<=bookeddropdate || (startdate<=bookeddropdate && dropdate<=bookeddropdate))
                    {
                        flag=1
                    }
                }
            } 
            else if(startyear===bookedstartyear && dropyear===bookeddropyear)
            {
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

            if(flag===1 && uid!==bookingDetails[i].uid)
            {
                bookeddata.push(bookingDetails[i])
                flag=0
                break;
            }
            else 
            {
                flag=0
            }
        }

        return bookeddata;
} 
module.exports={ExtendTripCars}