import React, {useEffect} from "react";
import ConsoleAndPhoto from "../components/ConsoleAndPhoto/ConsoleAndPhoto";
import ProjectsTable from "../components/ProjectsTable/ProjectsTable";

import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import ProjectDescription from "../components/ProjectDescription/ProjectDescription";
import ProjectInformationBlock from "../components/ProjectInformationBlock/ProjectInformationBlock";
import {useProfile} from "../hooks/use-profile";
import {getProfile} from "../store/slices/profileSlice";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {getProjects} from "../store/slices/projectsSlice";
import {useProjects} from "../hooks/use-projects";
import PortfolioUpperPart from "../components/PortfolioUpperPart/PortfolioUpperPart";
import {getPortfolio} from "../store/slices/portfolioSlice";
import {useAuth} from "../hooks/use-auth";
import {usePortfolio} from "../hooks/use-portfolio";
import {NotActivateAccount} from "./NotActivateAccount";
import Loading from "../components/Loading/Loading";
import {NotFilledAccount} from "./NotFilledAccount";
import {NotFoundPage} from "./NotFoundPage";
import FavouriteProjects from "../components/FavouriteProjects/FavouriteProjects";

export const ProjectsPage = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProfile(userId));
        dispatch(getPortfolio(userId));
        debugger
    }, []);

    const user = useAuth();

    const profile = useProfile();
    const portfolio = usePortfolio();
    console.log(portfolio);

    if(!profile.activate && user.id===profile.id)
        return <NotActivateAccount userID={user.id}/>

    if (portfolio.isLoading)
        return <Loading/>

    if(!profile.name && user.id===profile.id)
        return <NotFilledAccount userID={user.id}/>

    if(!profile.id || !profile.name)
        return <NotFoundPage/>


    const projects = [
        {
            "id":"1",
            "name":"АвтоМагШина",
            "shortDescription":"Online store of tires and wheels with selection by car model",
            "previewSource":"images\/previews\/1.png"
        },
        {
            "id":"2",
            "name":"УралМебель",
            "shortDescription":"Online store of upholstered furniture in a modern style",
            "previewSource":"images\/previews\/1.png"
        },
    ]

    /*const projects = [
        {
            id: 0,
            categoryId: 0,
            title: "AutoMagShina",
            description: "Online store of tires and wheels with selection by car model",
            imgURL: projectImage0
        },
        {
            id: 1,
            categoryId: 0,
            title: "UralMebel",
            description: "Online store of upholstered furniture in a modern style",
            imgURL: projectImage1
        },

        {id: 2, categoryId: 1, title: "Pool booking", description: "Бронирование бассейна", imgURL: projectImage2},
        {
            id: 3,
            categoryId: 1,
            title: "U Summer School",
            description: "Сервис подбора на стажировки",
            imgURL: testImage
        },

        {id: 4, categoryId: 2, title: "Library", description: "Сервис учёта книг в библиотеке", imgURL: testImage},
        {
            id: 5,
            categoryId: 2,
            title: "ITS-Economy",
            description: "Онлайн-банкинг виртальной валюты",
            imgURL: testImage
        },
        {
            id: 6,
            categoryId: 2,
            title: "Tinfoff Teams",
            description: "Сервис подбора друзей по хобби",
            imgURL: testImage
        },
        {
            id: 7,
            categoryId: 2,
            title: "Yellow Car Counter",
            description: "Сервис учёта жёлтых машин",
            imgURL: testImage
        },

        {id: 8, categoryId: 3, title: "Matrix Calculator", description: "Калькулятор матриц", imgURL: testImage},
        {
            id: 9,
            categoryId: 3,
            title: "Gauss Solver",
            description: "Решение систем линейных уравнений методом Гаусса-Жорданна\n",
            imgURL: testImage
        },
        {
            id: 10,
            categoryId: 3,
            title: "Lagrange",
            description: "Интерполяционный многочлен Лагранжа",
            imgURL: testImage
        },
        {
            id: 11,
            categoryId: 3,
            title: "Trees Visualizer",
            description: "Визуализатор структуры данных \"Деревья\"",
            imgURL: projectImage11
        },
        {id: 12, categoryId: 3, title: "Graph Calculator", description: "Калькулятор графиков", imgURL: testImage},
        {id: 13, categoryId: 3, title: "Shulte's Table", description: "Таблица Шульте", imgURL: testImage},
        {id: 14, categoryId: 3, title: "Magic Square", description: "Магический квадрат", imgURL: testImage},

        {
            id: 15,
            categoryId: 4,
            title: "Hero Return",
            description: "Выпускная работа за первый курс обучения - Lazy-RPG Game",
            imgURL: projectImage15
        },
    ]*/

    /*const categories = [
        {id: 0, title: "Commercial"},
        {id: 1, title: "Ural Federal University"},
        {id: 2, title: "Personal"},
        {id: 3, title: "IT-school"},
        {id: 4, title: "Game Development"},
    ]

    const informationBlocks = [
        {
            "id": 1,
            "blockType": "Text",
            "blockTitle": "Platform",
            "content": "Windows/macOS/Linux/iOS/Android"
        },
        {
            "id": 0,
            "blockType": "Link",
            "blockTitle": "Website",
            "content": "https://www.inkdrop.app/"
        }
    ]*/
    return (
        <div>
            <PortfolioUpperPart name={profile.name}
                                surname={profile.surname}
                                tags={profile.tags}
                                shortDescription={profile.shortDescription}
                                likes={100}
                                projects={49}
                                edit={false}
                                yourAccount={user.id === profile.id}
            />
            <FavouriteProjects projects={projects}/>
            {/*<ConsoleAndPhoto toRotate={profile.positions}/>*/}
            {/*<FavouriteProjects/>*/}
            {/*<ProjectDescription*/}
            {/*    text={"A Markdown note-taking app with 100+ plugins, cross-platform and encrypted data sync support. The life-time revenue is more than $300k."}/>*/}
            {/*<ProjectInformationBlock informationBlocks={informationBlocks}/>*/}
                {
                    // projectsBlocks.length !== 0?
                    //     projectsBlocks.map(block => {
                    //         return <ProjectsTable title={block.blockTitle} projects={block.projects}/>
                    //     }) : <></>

                }

            {/*{*/}
            {/*    projectsBlocks.blocks.map(block => <ProjectsTable title={block.blockTitle} projects={block.projects}/>)*/}
            {/*}*/}
        </div>
    )
}
