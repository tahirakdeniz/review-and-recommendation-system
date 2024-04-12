package com.rrss.backend.util;
import com.rrss.backend.model.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import java.security.Principal;

@Component
public class UserUtil {

    public User extractUser(Principal currentUser) {
        return (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();
    }

}
