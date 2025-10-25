
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/sophiageorgieva/opt/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/sophiageorgieva/opt/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/sophiageorgieva/opt/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/sophiageorgieva/opt/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

export PATH="$(npm bin -g):$PATH"
export PATH="/Users/sophiageorgieva/.npm-global/bin:$PATH"

