// ไอคอนแบบเส้น ใช้สีตาม color ของ element แม่ (currentColor)
function Svg({ children, size = 20, ...props }){
    return(
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    )
}

export const PlusIcon = (props) => (
    <Svg {...props}><path d="M12 5v14M5 12h14"/></Svg>
)

export const PanelIcon = (props) => (
    <Svg {...props}>
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M9 3v18"/>
    </Svg>
)

export const MenuIcon = (props) => (
    <Svg {...props}><path d="M4 6h16M4 12h16M4 18h16"/></Svg>
)

export const ChatIcon = (props) => (
    <Svg {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></Svg>
)

export const ShieldIcon = (props) => (
    <Svg {...props}>
        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/>
        <path d="M9 12l2 2 4-4"/>
    </Svg>
)

export const LoginIcon = (props) => (
    <Svg {...props}>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
        <path d="M10 17l5-5-5-5"/>
        <path d="M15 12H3"/>
    </Svg>
)

export const UserIcon = (props) => (
    <Svg {...props}>
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>
    </Svg>
)

export const PaperclipIcon = (props) => (
    <Svg {...props}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </Svg>
)

export const SendIcon = (props) => (
    <Svg {...props}>
        <path d="m22 2-7 20-4-9-9-4Z"/>
        <path d="M22 2 11 13"/>
    </Svg>
)

export const PhoneIcon = (props) => (
    <Svg {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </Svg>
)

export const CloseIcon = (props) => (
    <Svg {...props}><path d="M18 6 6 18M6 6l12 12"/></Svg>
)

export const CheckCircleIcon = (props) => (
    <Svg {...props}>
        <circle cx="12" cy="12" r="10"/>
        <path d="m8 12 3 3 5-6"/>
    </Svg>
)

export const XCircleIcon = (props) => (
    <Svg {...props}>
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 9 6 6M15 9l-6 6"/>
    </Svg>
)

// รูปหุ่นยนต์ประจำตัว AI
export const BotAvatar = ({ size = 40, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" {...props}>
        <circle cx="24" cy="24" r="23" fill="#101F30" stroke="#1D344B" strokeWidth="1.5"/>
        <rect x="9.5" y="20" width="4" height="10" rx="2" fill="#36E6B0"/>
        <rect x="34.5" y="20" width="4" height="10" rx="2" fill="#36E6B0"/>
        <path d="M24 14.5V10.5" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="9.5" r="2" fill="#36E6B0"/>
        <rect x="13" y="14" width="22" height="20" rx="8" fill="#F1F5F9"/>
        <rect x="16" y="18" width="16" height="11" rx="5.5" fill="#081522"/>
        <circle cx="20.5" cy="23.5" r="2" fill="#36E6B0"/>
        <circle cx="27.5" cy="23.5" r="2" fill="#36E6B0"/>
    </svg>
)
