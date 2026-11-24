// ChatMind Knowledge Base & Response Templates
// Source: Prasana Hatake V2.0 + Game Maintenance Channels
window.CHATMIND_KB = {
  categories: [
    {
      id: "deposit_receipt",
      name: "Receipt / Slips",
      badge: "SLIP",
      triggers: ["receipt", "slip", "transfer", "bank in", "deposited", "in already", "check slip", "resubmit"],
      templates: [
        {
          label: "RCV (Resubmit Deposit)",
          text: "Dear, please resubmit your deposit request on our website, and we will assist you accordingly. Thank you.",
          tags: ["rcv", "resubmit", "deposit success"]
        },
        {
          label: "NO RCV (Funds Not Received)",
          text: "Dear, we have not received your funds yet, so kindly allow some time while our Finance Team reviews the transaction. Once the funds are confirmed as received, we will proceed with the necessary processing. Thank you for your patience and understanding.",
          tags: ["no rcv", "not in", "pending bank"]
        },
        {
          label: "NO RCV 24h Bank Statement",
          text: "Dear, we sincerely apologize for the inconvenience. After checking with our Finance Team, we can confirm that the funds have still not reached us. Please kindly allow up to 24 hours, then provide your bank statement in PDF format along with the correct payment receipt. Our relevant team will review the details, and if the funds are received on our end, we will credit them to your account accordingly. Thank you for your patience and cooperation.",
          tags: ["statement", "pdf", "24 hours", "no rcv"]
        },
        {
          label: "D CLAIM (Receipt Already Claimed)",
          text: "Dear, as checked in our system, this payment receipt has already been claimed successfully. Please do not submit the same receipt multiple times, as each receipt can only be used for one claim. Thank you for your understanding.",
          tags: ["claimed", "duplicate", "d claim"]
        },
        {
          label: "NOT OUR BANK (Wrong Recipient)",
          text: "Dear, we are sorry, but after checking the payment receipt, we found that the bank account you transferred to does not belong to us. Kindly verify the recipient bank details and contact the receiving bank or payment provider for further assistance.",
          tags: ["wrong bank", "not our bank"]
        }
      ]
    },
    {
      id: "payid",
      name: "PayID / Bank Details",
      badge: "PAYID",
      triggers: ["payid", "pay id", "bsb", "commbank", "cba", "bank details", "where to deposit", "account number"],
      templates: [
        {
          label: "PayID for Deposit",
          text: "Dear, please use this PayID for your deposit. Kindly do not save our bank details, as they may change from time to time. Thank you.",
          tags: ["payid", "do not save"]
        },
        {
          label: "Check Latest PayID on Website",
          text: "Dear, kindly refresh the website and check for the latest available PayID before making your deposit. Please use only the currently displayed PayID to complete the transaction. Thank you.",
          tags: ["refresh", "latest payid"]
        },
        {
          label: "PayID Hold Moment",
          text: "Dear, kindly hold on for a moment! We will provide you with a new PayID for your deposit shortly. Thank you so much for your patience!",
          tags: ["hold payid", "new payid"]
        },
        {
          label: "PayID Not Working (Ask New)",
          text: "Dear, Your PayID is not working for payment. Kindly provide a new PayID so we can proceed.",
          tags: ["not working", "payid fail"]
        },
        {
          label: "CommBank PayID Unavailable",
          text: "Dear, the PayID for CommBank is currently unavailable. Kindly use an alternative available payment method for the time being. Thank you for your understanding.",
          tags: ["commbank", "cba", "unavailable"]
        },
        {
          label: "Use Alternative Gateway (Amopay / Crypto)",
          text: "Dear, if you’re having trouble completing your deposit through the current payment option, kindly try using another available payment gateway on our website, such as Amopay or Crypto Payment. Please select your preferred option from the available payment methods and follow the instructions provided on the website to complete the deposit. Thank you for your patience and cooperation.",
          tags: ["amopay", "crypto", "gateway"]
        }
      ]
    },
    {
      id: "withdrawal",
      name: "Withdrawal / Cuci",
      badge: "WITHDRAW",
      triggers: ["withdraw", "cuci", "withdrawal", "money not in", "haven't receive", "pending withdraw", "cash out"],
      templates: [
        {
          label: "Withdrawal Released (Up to 72h)",
          text: "Dear, we confirm that your payment has been successfully released. Please note that bank processing may take up to 72 hours for the funds to reflect in your account. We appreciate your patience.",
          tags: ["72 hours", "released", "cuci done"]
        },
        {
          label: "Withdrawal Success & Checking",
          text: "Dear, your withdrawal has been processed and sent successfully from our side today. If you have not received it yet, kindly allow up to 72 hours for the funds to be reflected in your bank account, as processing times may vary. Please kindly be patient and understand that we are monitoring the situation. If we receive any further updates from our Finance Team, we will notify you accordingly. Thank you for your understanding.",
          tags: ["success", "processing time"]
        },
        {
          label: "Allow 1-3 Days (Standard Bank Time)",
          text: "Dear, kindly allow another 1–3 days for the funds to arrive, as this is usually within the bank’s standard processing time. Please check again after that. Meanwhile, we’ll check whether the payment has been returned to our bank. Thank you for your patience and understanding.",
          tags: ["1-3 days", "bank return"]
        },
        {
          label: "Confirm Process via BSB",
          text: "Dear, could you please confirm whether we may process your withdrawal via BSB bank transfer? Once we receive your confirmation, we will proceed accordingly. Thank you.",
          tags: ["bsb", "confirm bsb"]
        },
        {
          label: "CommBank Not Accepted for Withdrawal",
          text: "Dear, please note that we are no longer accepting CommBank accounts for withdrawals. Kindly provide another supported bank account for your withdrawal. However, you can still make a deposit using your CommBank account. Thank you for your cooperation.",
          tags: ["commbank withdraw", "cba rejected"]
        },
        {
          label: "No Redeposit Allowed While Pending",
          text: "Dear, redepositing is not allowed on our platform. Please wait until your withdrawal is completed before making a new transaction or playing again. Thank you for your understanding and patience.",
          tags: ["redeposit", "wait withdraw"]
        }
      ]
    },
    {
      id: "bonus",
      name: "Bonuses & Streaks",
      badge: "BONUS",
      triggers: ["bonus", "3+1", "4+1", "vip bonus", "streak", "free credit", "rebate", "rollover", "turnover", "lucky number"],
      templates: [
        {
          label: "3+1 Bonus: Need 3 Consecutive Deposits",
          text: "Dear, if you would like to apply for the 3+1 Bonus, kindly complete 3 consecutive deposits in a row without claiming any other bonus in between. Thank you Dear.",
          tags: ["3+1", "consecutive", "streak"]
        },
        {
          label: "3+1 Streak Count: 1 Done, Need 2 More",
          text: "Dear, you currently have 1 streak counted for the 3+1 Bonus promotion. Kindly make another 2 consecutive deposits without claiming any other bonus in between to complete the 3-streak requirement and qualify for the bonus.",
          tags: ["streak 1", "need 2"]
        },
        {
          label: "3+1 Streak Count: 2 Done, Need 1 More",
          text: "Dear, you currently have 2 streak counted for the 3+1 Bonus promotion. Kindly make another 1 consecutive deposits without claiming any other bonus in between to complete the 3-streak requirement and qualify for the bonus.",
          tags: ["streak 2", "need 1"]
        },
        {
          label: "3+1 Bonus Amount Explanation",
          text: "Dear, the payout amount for the 3+1 Bonus is determined based on the value of your latest three qualifying deposits.",
          tags: ["too less", "payout value"]
        },
        {
          label: "VIP Bonus: Already Claimed",
          text: "Dear, after checking your account, we can confirm that you have already claimed the VIP Bonus. Therefore, you are unable to claim the same bonus again. Thank you for your understanding.",
          tags: ["vip claimed", "duplicate"]
        },
        {
          label: "Deposit for VIP Bonus",
          text: "Dear, kindly make a deposit if you would like to apply for the VIP Bonus. Once the deposit is completed, we will assist you with the bonus request accordingly. Thank you Dear.",
          tags: ["vip deposit"]
        },
        {
          label: "Bonus Success Credited",
          text: "Great news! Your bonus has been successfully credited to your account. Have fun playing!",
          tags: ["credited", "bonus in"]
        },
        {
          label: "Rollover / Turnover Requirement",
          text: "Dear, you will need to meet the rollover requirement before you become eligible to withdraw your funds.",
          tags: ["rollover", "turnover"]
        },
        {
          label: "Free Credit Max Withdrawal ($20 Cap)",
          text: "Dear, as your winnings were received from free credits, the maximum withdrawal amount allowed is 20 AUD. Any remaining balance above this limit will be forfeited according to the bonus terms.",
          tags: ["free credit", "forfeit", "20 aud"]
        },
        {
          label: "Lucky Number Promotion",
          text: "Dear, once you make a single $30 deposit, you will receive a lucky number. You can check it on our website to see if your number matches and win a reward. If eligible, the reward will be automatically credited to your bonus section for you to claim.",
          tags: ["lucky number", "$30"]
        }
      ]
    },
    {
      id: "account_risk",
      name: "Multiple Accounts & Risk",
      badge: "SECURITY",
      triggers: ["multiple account", "duplicate account", "forfeit", "forfeited", "suspended", "cheating", "suspicious", "alter"],
      templates: [
        {
          label: "Multiple Accounts: Select One to Keep",
          text: "Dear, We have identified multiple accounts registered under the same name. In accordance with our Terms and Conditions, multiple accounts under the same name are not permitted. Kindly let us know which account you would like to keep using with us. Once you confirm, we will deactivate the other account and proceed. Thank you for your cooperation.",
          tags: ["multi acc", "choose one"]
        },
        {
          label: "Multiple Accounts: Credits Forfeited",
          text: "Dear, our system has detected multiple accounts associated with your name, which is against our policies. As a result, your credits have been forfeited according to our terms.",
          tags: ["multi acc forfeit"]
        },
        {
          label: "Other Account Deactivated Done",
          text: "Dear, your other account has now been deactivated. Kindly resubmit your withdrawal request, and we will proceed with processing it as soon as possible. Please do not create any additional accounts to avoid future withdrawal issues. Thank you for your cooperation and understanding, dear.",
          tags: ["deactivated", "resubmit withdraw"]
        },
        {
          label: "Suspicious Betting Detected",
          text: "Dear, we understand your concern. However, the system detected suspicious betting activity during gameplay, which resulted in the credits in your wallet being forfeited. If no such activity had been detected, your withdrawal would have been processed accordingly. Please also note that your last deposit has already been returned to you. Thank you for your understanding, dear.",
          tags: ["suspicious", "forfeited"]
        },
        {
          label: "ID Verification / Selfie Request",
          text: "Dear, for verification purposes, please provide a clear selfie of yourself holding your ID card. Additionally, kindly provide your bank details so our Finance Team can complete the verification process. Thank you for your cooperation.",
          tags: ["selfie", "id card", "kyc"]
        }
      ]
    },
    {
      id: "games_tech",
      name: "Games & Maintenance",
      badge: "GAME/VPN",
      triggers: ["cannot open", "download", "link", "vpn", "restricted", "region", "country", "mega888", "918kiss", "pussy888", "mario", "win rate"],
      templates: [
        {
          label: "Restricted Region / Turn Off VPN",
          text: "Dear, please disconnect any VPN, log out of your game or account, and restart your mobile device. Then connect using a stable Wi-Fi connection or your normal mobile data, without reconnecting to the VPN. Once connected normally, log back into the game. Thank you for your cooperation.",
          tags: ["vpn", "restricted region"]
        },
        {
          label: "918Kiss New Download Link",
          text: "Dear partners, 918kiss download again if cannot login. New download Link : tm.d.918kiss.com",
          tags: ["918kiss", "download"]
        },
        {
          label: "Mega888 (iOS) New Download Link",
          text: "Dear, if unable to login to MEGA888 on iOS, please uninstall previous app and reinstall with below link: https://m.mega777.cc/mega/index-b.html",
          tags: ["mega888", "ios"]
        },
        {
          label: "Pussy888 New Download Link",
          text: "Dear partners, Pussy888 server has returned to normal. If cannot open game, please download via: http://ytl.pussy888.com",
          tags: ["pussy888", "download"]
        },
        {
          label: "Cannot Control Win Rate",
          text: "Dear, we are sorry, but we do not have control over the win rates, as they are determined by the game provider. Would you like me to recommend some of today's popular games for you to try?",
          tags: ["win rate", "bad luck"]
        },
        {
          label: "Refresh & Try Again",
          text: "Dear, please refresh the website and try again. Thank you.",
          tags: ["refresh"]
        }
      ]
    },
    {
      id: "etiquette",
      name: "Courtesy & Warnings",
      badge: "SUPPORT",
      triggers: ["hold", "wait", "fuck", "scam", "idiot", "bastard", "slow", "stupid", "clarify", "thanks", "thank you"],
      templates: [
        {
          label: "Hold Customer / Checking",
          text: "Dear, we sincerely apologize for any confusion caused. Please allow us a moment while we check the issue for you, dear.",
          tags: ["hold", "checking"]
        },
        {
          label: "Clarify Issue",
          text: "Dear, could you kindly clarify the issue you are facing so I can help you resolve it? Thank you.",
          tags: ["clarify", "what problem"]
        },
        {
          label: "First Warning (Abusive Language)",
          text: "Dear, we kindly ask that you communicate respectfully. This will help us assist you more effectively and resolve your concern as quickly as possible. Thank you for your understanding and cooperation.",
          tags: ["warning 1", "respectful"]
        },
        {
          label: "Final Warning (Terminate Support)",
          text: "Dear, We kindly request that you maintain respectful communication throughout this conversation. We are here to assist you; however, if abusive, offensive, or disrespectful language continues, we may be unable to provide further assistance. Thank you for your understanding and cooperation.",
          tags: ["warning final", "abusive"]
        },
        {
          label: "You're Welcome / Wish Good Luck",
          text: "You're welcome, dear. Wishing you the best of luck in your games and hoping you enjoy a great winning streak!",
          tags: ["welcome", "good luck"]
        }
      ]
    }
  ]
};
