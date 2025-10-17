package com.vibechat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.search.AndTerm;
import jakarta.mail.search.FlagTerm;
import jakarta.mail.search.FromTerm;
import jakarta.mail.search.SearchTerm;
import java.util.Properties;
import java.util.UUID;

@Service
public class EmailVerificationService {

    @Value("${vibechat.email.imap.host}")
    private String imapHost;

    @Value("${vibechat.email.imap.port}")
    private int imapPort;

    @Value("${vibechat.email.imap.username}")
    private String imapUsername;

    @Value("${vibechat.email.imap.password}")
    private String imapPassword;

    @Value("${vibechat.email.imap.security}")
    private String security;

    public boolean checkVerificationEmail(String userEmail, String verificationToken) {
        try {
            Properties props = new Properties();
            props.put("mail.store.protocol", "imap");
            props.put("mail.imap.host", imapHost);
            props.put("mail.imap.port", imapPort);
            props.put("mail.imap.ssl.enable", "true");

            if ("STARTTLS".equals(security)) {
                props.put("mail.imap.starttls.enable", "true");
            }

            Session session = Session.getInstance(props, null);
            Store store = session.getStore("imap");
            store.connect(imapHost, imapUsername, imapPassword);

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            // Search for unread messages from the user
            SearchTerm unreadTerm = new FlagTerm(new Flags(Flags.Flag.SEEN), false);
            SearchTerm fromTerm = new FromTerm(new InternetAddress(userEmail));
            SearchTerm combinedTerm = new AndTerm(unreadTerm, fromTerm);

            Message[] messages = inbox.search(combinedTerm);

            boolean found = false;
            for (Message message : messages) {
                String subject = message.getSubject();
                if (subject != null && subject.contains("VibeChat - Verify Your Email")) {
                    // Check if the message contains the verification token
                    String content = getTextContent(message);
                    if (content != null && content.contains(verificationToken)) {
                        found = true;
                        break;
                    }
                }
            }

            inbox.close(false);
            store.close();

            return found;

        } catch (Exception e) {
            System.err.println("Error checking verification email: " + e.getMessage());
            return false;
        }
    }

    private String getTextContent(Message message) throws Exception {
        if (message.isMimeType("text/plain")) {
            return (String) message.getContent();
        } else if (message.isMimeType("text/html")) {
            return (String) message.getContent();
        } else if (message.isMimeType("multipart/*")) {
            Multipart multipart = (Multipart) message.getContent();
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart bodyPart = multipart.getBodyPart(i);
                if (bodyPart.isMimeType("text/plain")) {
                    return (String) bodyPart.getContent();
                } else if (bodyPart.isMimeType("text/html")) {
                    return (String) bodyPart.getContent();
                }
            }
        }
        return null;
    }
}
