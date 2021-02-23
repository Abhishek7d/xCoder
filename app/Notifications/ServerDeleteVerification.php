<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ServerDeleteVerification extends Notification
{
    use Queueable;
    private $code = null;
    private $user = null;
    private $server = null;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($server, $code, $user)
    {
        $this->code = $code;
        $this->user = $user;
        $this->server = $server;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Verification Code')
            ->greeting("Dear " . $this->user->name)
            ->line("This is the verification code to delete: <strong>$this->server</strong>, use this code to delete.")
            ->line("<h2><center>Verification Code</center></h2>")
            ->line("<h1><center>" . $this->code . "</center></h1>")
            ->line("")
            ->line("<center><strong>This code is valid for 10 minutes.</strong></center>")
            ->line("<br/>")
            ->line("If you have not requested this, please check your delegate access.")
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
