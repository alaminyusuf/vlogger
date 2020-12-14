import { NextPage } from 'next';
import { Formik, Form } from 'formik';
import { Button } from '@chakra-ui/react';
import Wrapper from '../../components/Container';
import InputField from '../../components/InputField';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          // const response = await login(values);
          // if (response.data?.login.errors) {
          //   setErrors(errorMapUtil(response.data.login.errors));
          // } else if (response.data?.login.user) {
          //   router.push('/');
          // }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              label='New Password'
              placeholder='New Password'
              type='password'
            />
            <Button
              type='submit'
              mt={4}
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
