import {
    Tabs,
    TabsHeader,// Add the missing import statement
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

import { useLocation, useNavigate} from "react-router-dom";
import React, { useState, useEffect } from "react";
import classService from "../../services/class.service";
import { TabEverybodyManager } from "./tabeverybody.component";
import {TabNewsManager} from "./tabnew.component";
export function ClassDetailManager() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const classId = queryParams.get("id");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
           //some code
              
          };
          
          fetchData();

    }, [classId]);
    return (
        <div className="">
      
                        <TabEverybodyManager ></TabEverybodyManager>
              
        </div>
    );
}