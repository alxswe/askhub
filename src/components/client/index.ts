import { AxiosRequestConfig } from "axios";
import { AxiosClient } from "axios-clt";

const sharedConfig = {
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
};

const httpConfig: AxiosRequestConfig = {
    ...sharedConfig,
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    paramsSerializer: { indexes: null },
};

export const httpClient = new AxiosClient({
    config: httpConfig,
    aliases: {
        // auth
        "auth/user": "/api/auth/user/",
        "auth/user-detail": "/api/auth/user/:id/",
        "auth/user_settings": "/api/auth/user/settings/",
        "auth/logout": "/api/auth/logout/",
        "auth/password_change": "/api/auth/password/change/",

        // Models
        "blog/questions": "/api/blog/question/",
        "blog/question": "/api/blog/question/:id/",
        "blog/question-add-like": "/api/blog/question/:id/add_like/",
        "blog/question-remove-like": "/api/blog/question/:id/remove_like/",
        "blog/comments": "/api/blog/comment/",
        "blog/comment": "/api/blog/comment/:id/",
        "blog/communities": "/api/blog/community/",
        "blog/community": "/api/blog/community/:id/",
        "blog/community-join": "/api/blog/community/:id/add_member/",
        "blog/community-leave": "/api/blog/community/:id/remove_member/",
        "blog/community-add-moderator": "/api/blog/community/:id/add_mod/",
        "blog/community-remove-moderator": "/api/blog/community/:id/remove_mod/",
    },
});

const serverConfig: AxiosRequestConfig = {
    ...sharedConfig,
    baseURL: process.env.BASEURL,
};

export const serverClient = new AxiosClient({
    config: serverConfig,
    aliases: {
        // Login
        gh_login: "/api/auth/github/",
        login: "/api/auth/login/",
        // Registration
        register: "/api/auth/registration/",
        verify_email: "/api/auth/registration/verify-email/",
        resend_email: "/api/auth/registration/resend-email/",
        // Password
        change_password: "/api/auth/password/change/",
        reset_password: "/api/auth/password/reset/",
        confirm_reset_password: "/api/auth/password/reset/confirm/",
    },
});
