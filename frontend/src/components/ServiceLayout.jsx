import React, {useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import Header from './Header/Header';
import 'react-toastify/dist/ReactToastify.css';
import WidthContent from "./WidthContent/WidthContent";

const WorkersLayout = (props) => {
    return (
        <>
            <Header withSecond typeSecond={"Service"} page={props.page}/>
            <WidthContent>
                <Outlet/>
            </WidthContent>
            {/*<PageTitle/>*/}
        </>
    );
};

export default WorkersLayout;
