import React from 'react';
import s from './Badge.module.css';

function Badge(props) {
    return (
        <div className={s.badge}>
            {props.title}
            {props.onClick ?
                <div onClick={props.onClick} className={s.cross}>
                    <svg width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.073308 0.429224C0.0500665 0.405982 0.0316304 0.378391 0.0190522 0.348024C0.00647395 0.317658 2.44889e-10 0.285111 0 0.252243C-2.44889e-10 0.219374 0.00647395 0.186827 0.0190522 0.156461C0.0316304 0.126094 0.0500665 0.0985027 0.073308 0.0752612C0.0965496 0.0520196 0.124141 0.0335835 0.154508 0.0210053C0.184874 0.00842707 0.217421 0.00195312 0.250289 0.00195313C0.283158 0.00195313 0.315705 0.00842707 0.346071 0.0210053C0.376438 0.0335835 0.404029 0.0520196 0.427271 0.0752612L3 2.64849L5.57273 0.0752612C5.59597 0.0520196 5.62356 0.0335835 5.65393 0.0210053C5.6843 0.00842707 5.71684 0.00195313 5.74971 0.00195313C5.78258 0.00195312 5.81513 0.00842707 5.84549 0.0210053C5.87586 0.0335835 5.90345 0.0520196 5.92669 0.0752612C5.94993 0.0985027 5.96837 0.126094 5.98095 0.156461C5.99353 0.186827 6 0.219374 6 0.252243C6 0.285111 5.99353 0.317658 5.98095 0.348024C5.96837 0.378391 5.94993 0.405982 5.92669 0.429224L3.35346 3.00195L5.92669 5.57468C5.94993 5.59792 5.96837 5.62552 5.98095 5.65588C5.99353 5.68625 6 5.7188 6 5.75166C6 5.78453 5.99353 5.81708 5.98095 5.84745C5.96837 5.87781 5.94993 5.9054 5.92669 5.92865C5.90345 5.95189 5.87586 5.97032 5.84549 5.9829C5.81513 5.99548 5.78258 6.00195 5.74971 6.00195C5.71684 6.00195 5.6843 5.99548 5.65393 5.9829C5.62356 5.97032 5.59597 5.95189 5.57273 5.92865L3 3.35542L0.427271 5.92865C0.404029 5.95189 0.376438 5.97032 0.346071 5.9829C0.315705 5.99548 0.283158 6.00195 0.250289 6.00195C0.217421 6.00195 0.184874 5.99548 0.154508 5.9829C0.124141 5.97032 0.0965496 5.95189 0.073308 5.92865C0.0500665 5.9054 0.0316304 5.87781 0.0190522 5.84745C0.00647395 5.81708 0 5.78453 0 5.75166C0 5.7188 0.00647395 5.68625 0.0190522 5.65588C0.0316304 5.62552 0.0500665 5.59792 0.073308 5.57468L2.64654 3.00195L0.073308 0.429224Z" fill="black"/>
                    </svg>
                </div>: <></>
            }
        </div>
    )
}

export default Badge;
